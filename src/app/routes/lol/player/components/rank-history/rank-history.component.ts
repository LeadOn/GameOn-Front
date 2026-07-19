import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Subscription, skip } from 'rxjs';
import { Chart, ChartDataset } from 'chart.js/auto';
import {
  LeagueOfLegendsRankHistory,
  LoLRankHistoryGranularity,
} from '../../../../../shared/classes/lol/LeagueOfLegendsRankHistory';
import { formatRelativeDate } from '../../../../../shared/classes/lol/lol-match.util';
import { APEX_TIERS, tierLabel } from '../../../../../shared/classes/lol/lol-tier.util';
import { ThemeService } from '../../../../../shared/services/common/theme.service';

const SERIES_COLORS = {
  light: { solo: '#4d6ce5', flex: '#0ea47a' },
  dark: { solo: '#6b8afb', flex: '#1b998b' },
};

const GRID_COLOR = 'rgba(156, 163, 175, 0.15)';
const AVERAGE_LINE_COLOR = 'rgba(156, 163, 175, 0.5)';

// Linear point scale used only to place tiers on an evenly-spaced Y axis.
const TIER_BASE_POINTS: [string, number][] = [
  ['IRON', 0],
  ['BRONZE', 400],
  ['SILVER', 800],
  ['GOLD', 1200],
  ['EMERALD', 1600],
  ['PLATINUM', 2000],
  ['DIAMOND', 2400],
  ['MASTER', 2800],
  ['GRANDMASTER', 3200],
  ['CHALLENGER', 3600],
];
const DIVISION_POINTS: Record<string, number> = { I: 300, II: 200, III: 100, IV: 0 };

interface RankPoint {
  x: number;
  y: number;
  entry: LeagueOfLegendsRankHistory;
}

interface QueueSummary {
  label: string;
  color: string;
  oldest: LeagueOfLegendsRankHistory;
  newest: LeagueOfLegendsRankHistory;
}

// The backend emits one raw point per period, but real change events keep
// their exact event timestamp rather than a rounded period boundary. Solo
// and Flex changes that land in the "same" period can therefore differ by
// mere milliseconds, which would otherwise plot them as two separate x-axis
// columns instead of one. Rounding down to the period's start aligns same-
// period points from both queues onto a single shared column.
function periodStart(date: Date, granularity: LoLRankHistoryGranularity): number {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);

  switch (granularity) {
    case 'Day':
      return d.getTime();
    case 'Week': {
      const mondayOffset = (d.getDay() + 6) % 7;
      d.setDate(d.getDate() - mondayOffset);
      return d.getTime();
    }
    case 'Month':
      return new Date(d.getFullYear(), d.getMonth(), 1).getTime();
  }
}

function hexToRgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Draws one dashed horizontal line at the average of all plotted values.
const averageLinePlugin = {
  id: 'averageLine',
  afterDatasetsDraw(chart: any) {
    const { ctx, chartArea, scales } = chart;

    if (chartArea == null) {
      return;
    }

    const values = chart.data.datasets
      .flatMap((dataset: any) => dataset.data)
      .filter((value: number | null) => value != null) as number[];

    if (values.length === 0) {
      return;
    }

    const average = values.reduce((a, b) => a + b, 0) / values.length;
    const y = scales['y'].getPixelForValue(average);

    ctx.save();
    ctx.setLineDash([4, 4]);
    ctx.strokeStyle = AVERAGE_LINE_COLOR;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(chartArea.left, y);
    ctx.lineTo(chartArea.right, y);
    ctx.stroke();
    ctx.restore();
  },
};

@Component({
  selector: 'app-rank-history',
  templateUrl: './rank-history.component.html',
  styleUrl: './rank-history.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class RankHistoryComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @Input()
  rankHistory: LeagueOfLegendsRankHistory[] = [];

  @Input()
  granularity: LoLRankHistoryGranularity = 'Day';

  @ViewChild('rankHistoryChart')
  rankHistoryChart?: ElementRef<HTMLCanvasElement>;

  chart: any;
  queueSummaries: QueueSummary[] = [];
  formatRelativeDate = formatRelativeDate;
  tierLabel = tierLabel;

  private themeSubscription?: Subscription;

  constructor(private themeService: ThemeService) {}

  ngAfterViewInit(): void {
    queueMicrotask(() => this.rebuildChart());

    // skip(1): theme$ is a BehaviorSubject and replays the current value
    // immediately on subscribe, which would rebuild synchronously a second
    // time in this same lifecycle hook. Only react to actual later toggles.
    this.themeSubscription = this.themeService.theme$
      .pipe(skip(1))
      .subscribe(() => {
        this.rebuildChart();
      });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['rankHistory'] || changes['granularity']) {
      queueMicrotask(() => this.rebuildChart());
    }
  }

  ngOnDestroy(): void {
    this.themeSubscription?.unsubscribe();
    this.destroyChart();
  }

  destroyChart() {
    if (this.chart != null) {
      this.chart.destroy();
      this.chart = null;
    }
  }

  rebuildChart() {
    this.destroyChart();
    this.queueSummaries = [];

    if (this.rankHistory == null || this.rankHistory.length === 0) {
      return;
    }

    this.buildChart();
  }

  private scoreFor(entry: LeagueOfLegendsRankHistory): number {
    const tier = entry.tier?.toUpperCase() ?? '';
    const division = entry.rank?.toUpperCase() ?? '';
    const base = TIER_BASE_POINTS.find(([name]) => name === tier)?.[1] ?? 0;
    // Master/Grandmaster/Challenger have no real divisions — Riot fills
    // `rank` with a legacy "I" placeholder there, which must not contribute.
    const divisionPoints = APEX_TIERS.has(tier) ? 0 : (DIVISION_POINTS[division] ?? 0);
    return base + divisionPoints + entry.leaguePoints;
  }

  private toPoints(entries: LeagueOfLegendsRankHistory[]): RankPoint[] {
    return entries
      .map((entry) => ({
        x: periodStart(new Date(entry.createdOn), this.granularity),
        y: this.scoreFor(entry),
        entry,
      }))
      .sort((a, b) => a.x - b.x);
  }

  buildChart() {
    if (this.rankHistoryChart == null) {
      return;
    }

    const existingChart = Chart.getChart(this.rankHistoryChart.nativeElement);

    if (existingChart != null) {
      existingChart.destroy();
    }

    const soloPoints = this.toPoints(
      this.rankHistory.filter((h) => h.queueType === 'RANKED_SOLO_5x5'),
    );
    const flexPoints = this.toPoints(
      this.rankHistory.filter((h) => h.queueType === 'RANKED_FLEX_SR'),
    );

    const theme = this.themeService.theme;
    const colors = SERIES_COLORS[theme];

    this.queueSummaries = [
      soloPoints.length > 0
        ? {
            label: 'Solo 5v5',
            color: colors.solo,
            oldest: soloPoints[0].entry,
            newest: soloPoints[soloPoints.length - 1].entry,
          }
        : null,
      flexPoints.length > 0
        ? {
            label: 'Flex 5v5',
            color: colors.flex,
            oldest: flexPoints[0].entry,
            newest: flexPoints[flexPoints.length - 1].entry,
          }
        : null,
    ].filter((summary): summary is QueueSummary => summary != null);

    // Both queues share one x-axis, aligned by their real timestamps rather
    // than by index, so unrelated events never get forced onto the same tick.
    const timestamps = Array.from(
      new Set([...soloPoints, ...flexPoints].map((p) => p.x)),
    ).sort((a, b) => a - b);

    const alignToTimeline = (points: RankPoint[]) => {
      const byTimestamp = new Map(points.map((p) => [p.x, p]));
      return {
        data: timestamps.map((t) => byTimestamp.get(t)?.y ?? null),
        entries: timestamps.map((t) => byTimestamp.get(t)?.entry ?? null),
      };
    };

    const buildDataset = (
      label: string,
      points: RankPoint[],
      color: string,
    ): ChartDataset<'line'> => {
      const { data, entries } = alignToTimeline(points);

      let lastIndex = -1;
      for (let i = data.length - 1; i >= 0; i--) {
        if (data[i] != null) {
          lastIndex = i;
          break;
        }
      }

      return {
        label,
        data,
        entries,
        borderColor: color,
        backgroundColor: (context: any) => {
          const { ctx, chartArea } = context.chart;
          if (!chartArea) return hexToRgba(color, 0.2);
          const gradient = ctx.createLinearGradient(
            0,
            chartArea.top,
            0,
            chartArea.bottom,
          );
          gradient.addColorStop(0, hexToRgba(color, 0.25));
          gradient.addColorStop(1, hexToRgba(color, 0));
          return gradient;
        },
        borderWidth: 2.5,
        pointBackgroundColor: color,
        pointBorderColor: color,
        pointBorderWidth: 0,
        pointRadius: (context: any) =>
          context.dataIndex === lastIndex ? 4 : 0,
        pointHoverRadius: 5,
        tension: 0.35,
        cubicInterpolationMode: 'monotone',
        fill: true,
        spanGaps: true,
      } as ChartDataset<'line'>;
    };

    const datasets: ChartDataset<'line'>[] = [];

    if (soloPoints.length > 0) {
      datasets.push(buildDataset('Solo 5v5', soloPoints, colors.solo));
    }

    if (flexPoints.length > 0) {
      datasets.push(buildDataset('Flex 5v5', flexPoints, colors.flex));
    }

    this.chart = new Chart(this.rankHistoryChart.nativeElement, {
      type: 'line',
      data: {
        labels: timestamps,
        datasets,
      },
      plugins: [averageLinePlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        // rebuildChart() destroys and recreates this Chart instance on every
        // range/theme change, so the default entrance animation replays each
        // time; disabling it avoids ever rendering (or screenshotting) a
        // mid-transition frame where gapped points are still easing in.
        animation: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            display: true,
            grid: {
              display: true,
              color: GRID_COLOR,
              drawTicks: false,
            },
            border: {
              display: false,
            },
            ticks: {
              display: false,
              maxTicksLimit: 3,
            },
          },
        },
        plugins: {
          legend: {
            display: datasets.length > 1,
            position: 'top',
            align: 'end',
            labels: {
              usePointStyle: true,
              pointStyle: 'circle',
              padding: 12,
              boxWidth: 6,
              boxHeight: 6,
              color: 'rgba(156, 163, 175, 0.9)',
              font: { size: 11 },
            },
          },
          tooltip: {
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            padding: 10,
            titleFont: { size: 12 },
            bodyFont: { size: 12 },
            cornerRadius: 6,
            displayColors: true,
            callbacks: {
              title: (context) => {
                const timestamp = timestamps[context[0].dataIndex];
                return new Intl.DateTimeFormat('fr-FR', {
                  day: '2-digit',
                  month: 'long',
                }).format(new Date(timestamp));
              },
              label: (context) => {
                const entry = (context.dataset as any).entries?.[
                  context.dataIndex
                ] as LeagueOfLegendsRankHistory | null;

                if (entry == null) {
                  return '';
                }

                return `${context.dataset.label}: ${this.tierLabel(entry)} · ${entry.leaguePoints} LP`;
              },
            },
          },
        },
      },
    });
  }
}
