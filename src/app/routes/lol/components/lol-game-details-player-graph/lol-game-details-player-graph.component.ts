import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { Chart } from 'chart.js/auto';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';

@Component({
  selector: 'app-lol-game-details-player-graph',
  standalone: false,

  templateUrl: './lol-game-details-player-graph.component.html',
  styleUrl: './lol-game-details-player-graph.component.css',
})
export class LolGameDetailsPlayerGraphComponent
  implements AfterViewInit, OnChanges, OnDestroy
{
  @ViewChild('damageChart')
  damageChartCanvas?: ElementRef<HTMLCanvasElement>;

  @ViewChild('goldChart')
  goldChartCanvas?: ElementRef<HTMLCanvasElement>;

  @ViewChild('xpChart')
  xpChartCanvas?: ElementRef<HTMLCanvasElement>;

  @Input()
  timeline?: LoLGameTimelineFrame[];

  chart?: Chart;
  chart2?: Chart;
  chart3?: Chart;

  ngAfterViewInit(): void {
    this.buildChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['timeline']) {
      this.rebuildChart();
    }
  }

  ngOnDestroy(): void {
    this.destroyCharts();
  }

  rebuildChart() {
    this.destroyCharts();
    this.buildChart();
  }

  private destroyCharts() {
    this.chart?.destroy();
    this.chart2?.destroy();
    this.chart3?.destroy();
    this.chart = undefined;
    this.chart2 = undefined;
    this.chart3 = undefined;
  }

  buildChart() {
    if (
      this.timeline == null ||
      this.timeline.length == 0 ||
      this.damageChartCanvas == null ||
      this.goldChartCanvas == null ||
      this.xpChartCanvas == null
    ) {
      return;
    }

    // First chart
    let labels: any[] = [];
    let totalDamageDone: any[] = [];
    let totalDamageTaken: any[] = [];
    let totalDamageDoneToChampions: any[] = [];

    let magicDamageDone: any[] = [];
    let magicDamageTaken: any[] = [];
    let magicDamageDoneToChampions: any[] = [];

    let physicalDamageDone: any[] = [];
    let physicalDamageTaken: any[] = [];
    let physicalDamageDoneToChampions: any[] = [];

    let trueDamageDone: any[] = [];
    let trueDamageTaken: any[] = [];
    let trueDamageDoneToChampions: any[] = [];

    let currentGold: any[] = [];
    let totalGold: any[] = [];
    let goldPerSecond: any[] = [];
    let minionsKilled: any[] = [];
    let jungleMinionsKilled: any[] = [];

    let xp: any[] = [];
    let level: any[] = [];

    if (this.timeline != null) {
      this.timeline.forEach((frame) => {
        labels.push(frame.timestamp);

        // Total damages
        totalDamageDone.push(
          frame.loLGameTimelineFrameParticipants[0].totalDamageDone,
        );
        totalDamageTaken.push(
          frame.loLGameTimelineFrameParticipants[0].totalDamageTaken,
        );
        totalDamageDoneToChampions.push(
          frame.loLGameTimelineFrameParticipants[0].totalDamageDoneToChampions,
        );

        // Magic damages
        magicDamageDone.push(
          frame.loLGameTimelineFrameParticipants[0].magicDamageDone,
        );
        magicDamageTaken.push(
          frame.loLGameTimelineFrameParticipants[0].magicDamageTaken,
        );
        magicDamageDoneToChampions.push(
          frame.loLGameTimelineFrameParticipants[0].magicDamageDoneToChampions,
        );

        // Physical damages
        physicalDamageDone.push(
          frame.loLGameTimelineFrameParticipants[0].physicalDamageDone,
        );
        physicalDamageTaken.push(
          frame.loLGameTimelineFrameParticipants[0].physicalDamageTaken,
        );
        physicalDamageDoneToChampions.push(
          frame.loLGameTimelineFrameParticipants[0]
            .physicalDamageDoneToChampions,
        );

        // True damages
        trueDamageDone.push(
          frame.loLGameTimelineFrameParticipants[0].trueDamageDone,
        );
        trueDamageTaken.push(
          frame.loLGameTimelineFrameParticipants[0].trueDamageTaken,
        );
        trueDamageDoneToChampions.push(
          frame.loLGameTimelineFrameParticipants[0].trueDamageDoneToChampions,
        );

        // Gold related
        totalGold.push(frame.loLGameTimelineFrameParticipants[0].totalGold);
        goldPerSecond.push(
          frame.loLGameTimelineFrameParticipants[0].goldPerSecond,
        );
        currentGold.push(frame.loLGameTimelineFrameParticipants[0].currentGold);
        minionsKilled.push(
          frame.loLGameTimelineFrameParticipants[0].minionsKilled,
        );
        jungleMinionsKilled.push(
          frame.loLGameTimelineFrameParticipants[0].jungleMinionsKilled,
        );

        // xp/level
        xp.push(frame.loLGameTimelineFrameParticipants[0].xp);
        level.push(frame.loLGameTimelineFrameParticipants[0].level);
      });
    }

    const gridColor = 'rgba(255, 255, 255, 0.08)';
    const tickColor = 'rgba(226, 232, 240, 0.85)';

    this.chart = new Chart(this.damageChartCanvas.nativeElement, {
      type: 'line',
      data: {
        // values on X-Axis
        labels: labels,
        datasets: [
          {
            label: 'Total dégâts infligés',
            data: totalDamageDone,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.2)',
            tension: 0.25,
            pointRadius: 0,
          },
          {
            label: 'Total dégâts reçus',
            data: totalDamageTaken,
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.2)',
            tension: 0.25,
            pointRadius: 0,
          },
          {
            label: 'Dégâts infligés aux champions',
            data: totalDamageDoneToChampions,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            tension: 0.25,
            pointRadius: 0,
          },
          {
            label: 'Dégâts magiques infligés',
            data: magicDamageDone,
            hidden: true,
            borderColor: '#eab308',
            tension: 0.25,
            pointRadius: 0,
          },
          {
            label: 'Dégâts magiques reçus',
            data: magicDamageTaken,
            hidden: true,
            borderColor: '#06b6d4',
            tension: 0.25,
            pointRadius: 0,
          },
          {
            label: 'Dégâts magiques aux champions',
            data: magicDamageDoneToChampions,
            hidden: true,
            borderColor: '#8b5cf6',
            tension: 0.25,
            pointRadius: 0,
          },
          {
            label: 'Dégâts physiques infligés',
            data: physicalDamageDone,
            hidden: true,
            borderColor: '#22c55e',
            tension: 0.25,
            pointRadius: 0,
          },
          {
            label: 'Dégâts physiques reçus',
            data: physicalDamageTaken,
            hidden: true,
            borderColor: '#f97316',
            tension: 0.25,
            pointRadius: 0,
          },
          {
            label: 'Dégâts physiques aux champions',
            data: physicalDamageDoneToChampions,
            hidden: true,
            borderColor: '#14b8a6',
            tension: 0.25,
            pointRadius: 0,
          },
          {
            label: 'Dégâts bruts infligés',
            data: trueDamageDone,
            hidden: true,
            borderColor: '#a855f7',
            tension: 0.25,
            pointRadius: 0,
          },
          {
            label: 'Dégâts bruts reçus',
            data: trueDamageTaken,
            hidden: true,
            borderColor: '#ec4899',
            tension: 0.25,
            pointRadius: 0,
          },
          {
            label: 'Dégâts bruts aux champions',
            data: trueDamageDoneToChampions,
            hidden: true,
            borderColor: '#64748b',
            tension: 0.25,
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: tickColor,
              boxWidth: 14,
              boxHeight: 8,
              font: {
                size: 10,
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: tickColor, maxTicksLimit: 7 },
            grid: { color: gridColor },
          },
          y: {
            ticks: { color: tickColor },
            grid: { color: gridColor },
          },
        },
      },
    });

    this.chart2 = new Chart(this.goldChartCanvas.nativeElement, {
      type: 'line',
      data: {
        // values on X-Axis
        labels: labels,
        datasets: [
          {
            label: 'Total des golds',
            data: totalGold,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.2)',
            tension: 0.25,
            pointRadius: 0,
          },
          {
            label: 'Golds actuels',
            data: currentGold,
            borderColor: '#fb7185',
            backgroundColor: 'rgba(251, 113, 133, 0.2)',
            tension: 0.25,
            pointRadius: 0,
          },
          {
            label: 'Golds par seconde',
            data: goldPerSecond,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.2)',
            tension: 0.25,
            pointRadius: 0,
            yAxisID: 'y1',
          },
          {
            label: 'CS tués',
            data: minionsKilled,
            borderColor: '#facc15',
            hidden: true,
            tension: 0.25,
            pointRadius: 0,
            yAxisID: 'y1',
          },
          {
            label: 'CS jungle',
            data: jungleMinionsKilled,
            borderColor: '#2dd4bf',
            hidden: true,
            tension: 0.25,
            pointRadius: 0,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: tickColor,
              boxWidth: 14,
              boxHeight: 8,
              font: {
                size: 10,
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: tickColor, maxTicksLimit: 7 },
            grid: { color: gridColor },
          },
          y: {
            ticks: { color: tickColor },
            grid: { color: gridColor },
          },
          y1: {
            position: 'right',
            ticks: { color: tickColor },
            grid: { drawOnChartArea: false },
          },
        },
      },
    });

    this.chart3 = new Chart(this.xpChartCanvas.nativeElement, {
      type: 'line',
      data: {
        // values on X-Axis
        labels: labels,
        datasets: [
          {
            label: 'Total XP',
            data: xp,
            borderColor: '#38bdf8',
            backgroundColor: 'rgba(56, 189, 248, 0.2)',
            tension: 0.25,
            pointRadius: 0,
          },
          {
            label: 'Niveau',
            data: level,
            borderColor: '#f43f5e',
            backgroundColor: 'rgba(244, 63, 94, 0.2)',
            tension: 0.25,
            pointRadius: 0,
            yAxisID: 'y1',
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: tickColor,
              boxWidth: 14,
              boxHeight: 8,
              font: {
                size: 10,
              },
            },
          },
        },
        scales: {
          x: {
            ticks: { color: tickColor, maxTicksLimit: 7 },
            grid: { color: gridColor },
          },
          y: {
            ticks: { color: tickColor },
            grid: { color: gridColor },
          },
          y1: {
            min: 0,
            max: 18,
            position: 'right',
            ticks: { color: tickColor, stepSize: 2 },
            grid: { drawOnChartArea: false },
          },
        },
      },
    });
  }
}
