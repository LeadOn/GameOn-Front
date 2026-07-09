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
import { Chart } from 'chart.js/auto';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';

@Component({
  selector: 'app-lol-game-details-player-graph',
  standalone: false,

  templateUrl: './lol-game-details-player-graph.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lol-game-details-player-graph.component.css',
})
export class LolGameDetailsPlayerGraphComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @ViewChild('goldChart')
  goldChartCanvas?: ElementRef<HTMLCanvasElement>;

  @Input()
  timeline?: LoLGameTimelineFrame[];

  chart?: Chart;

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeline']) {
      this.rebuildChart();
    }
  }

  ngOnDestroy(): void {
    this.destroyChart();
  }

  rebuildChart() {
    this.destroyChart();
    this.buildChart();
  }

  private destroyChart() {
    this.chart?.destroy();
    this.chart = undefined;
  }

  buildChart() {
    if (
      this.timeline == null ||
      this.timeline.length == 0 ||
      this.goldChartCanvas == null
    ) {
      return;
    }

    const labels = this.timeline.map((frame) => frame.timestamp);
    const gold = this.timeline.map(
      (frame) => frame.loLGameTimelineFrameParticipants[0]?.totalGold || 0,
    );

    const average =
      gold.length > 0 ? gold.reduce((a, b) => a + b, 0) / gold.length : 0;

    this.chart = new Chart(this.goldChartCanvas.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Or cumulé',
            data: gold,
            borderColor: '#d4ac0c',
            backgroundColor: 'rgba(212, 172, 12, 0.18)',
            fill: true,
            tension: 0.35,
            pointRadius: 0,
            borderWidth: 2,
          },
          {
            label: 'Moyenne',
            data: labels.map(() => average),
            borderColor: 'rgba(148, 163, 184, 0.4)',
            borderDash: [6, 6],
            pointRadius: 0,
            borderWidth: 1,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              title: () => '',
              label: (context) =>
                context.datasetIndex == 0
                  ? `${context.formattedValue} or`
                  : `Moyenne : ${context.formattedValue} or`,
            },
          },
        },
        scales: {
          x: { display: false },
          y: { display: false },
        },
      },
    });
  }
}
