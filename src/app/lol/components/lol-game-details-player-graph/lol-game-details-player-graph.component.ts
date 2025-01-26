import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LoLGameTimelineFrame } from '../../../shared/classes/lol/LoLGameTimelineFrame';
import { Chart } from 'chart.js/auto';
import { delay } from 'rxjs';

@Component({
  selector: 'app-lol-game-details-player-graph',
  standalone: false,

  templateUrl: './lol-game-details-player-graph.component.html',
  styleUrl: './lol-game-details-player-graph.component.scss',
})
export class LolGameDetailsPlayerGraphComponent implements OnInit, OnChanges {
  randomId = 'damage-history-' + (Math.random() * 10000).toFixed(0).toString();
  randomId2 = 'gold-history-' + (Math.random() * 10000).toFixed(0).toString();
  randomId3 = 'xp-history-' + (Math.random() * 10000).toFixed(0).toString();

  @Input()
  timeline?: LoLGameTimelineFrame[];

  chart: any;
  chart2: any;
  chart3: any;

  ngOnInit(): void {
    setTimeout(() => {
      this.buildChart();
    }, 500);
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.rebuildChart();
  }

  rebuildChart() {
    if (this.chart != null) {
      this.chart.destroy();
      this.chart2.destroy();
      this.chart3.destroy();
      this.buildChart();
    }
  }

  buildChart() {
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
          frame.loLGameTimelineFrameParticipants[0].totalDamageDone
        );
        totalDamageTaken.push(
          frame.loLGameTimelineFrameParticipants[0].totalDamageTaken
        );
        totalDamageDoneToChampions.push(
          frame.loLGameTimelineFrameParticipants[0].totalDamageDoneToChampions
        );

        // Magic damages
        magicDamageDone.push(
          frame.loLGameTimelineFrameParticipants[0].magicDamageDone
        );
        magicDamageTaken.push(
          frame.loLGameTimelineFrameParticipants[0].magicDamageTaken
        );
        magicDamageDoneToChampions.push(
          frame.loLGameTimelineFrameParticipants[0].magicDamageDoneToChampions
        );

        // Physical damages
        physicalDamageDone.push(
          frame.loLGameTimelineFrameParticipants[0].physicalDamageDone
        );
        physicalDamageTaken.push(
          frame.loLGameTimelineFrameParticipants[0].physicalDamageTaken
        );
        physicalDamageDoneToChampions.push(
          frame.loLGameTimelineFrameParticipants[0]
            .physicalDamageDoneToChampions
        );

        // True damages
        trueDamageDone.push(
          frame.loLGameTimelineFrameParticipants[0].trueDamageDone
        );
        trueDamageTaken.push(
          frame.loLGameTimelineFrameParticipants[0].trueDamageTaken
        );
        trueDamageDoneToChampions.push(
          frame.loLGameTimelineFrameParticipants[0].trueDamageDoneToChampions
        );

        // Gold related
        totalGold.push(frame.loLGameTimelineFrameParticipants[0].totalGold);
        goldPerSecond.push(
          frame.loLGameTimelineFrameParticipants[0].goldPerSecond
        );
        currentGold.push(frame.loLGameTimelineFrameParticipants[0].currentGold);
        minionsKilled.push(
          frame.loLGameTimelineFrameParticipants[0].minionsKilled
        );
        jungleMinionsKilled.push(
          frame.loLGameTimelineFrameParticipants[0].jungleMinionsKilled
        );

        // xp/level
        xp.push(frame.loLGameTimelineFrameParticipants[0].xp);
        level.push(frame.loLGameTimelineFrameParticipants[0].level);
      });
    }

    this.chart = new Chart(this.randomId, {
      type: 'line',
      data: {
        // values on X-Axis
        labels: labels,
        datasets: [
          { label: 'Total dégats infligés', data: totalDamageDone },
          { label: 'Total dégats reçus', data: totalDamageTaken },
          {
            label: 'Total dégats infligés aux champions',
            data: totalDamageDoneToChampions,
          },
          { label: 'Dégats magiques infligés', data: magicDamageDone },
          { label: 'Dégats magiques reçus', data: magicDamageTaken },
          {
            label: 'Dégats magiques infligés aux champions',
            data: magicDamageDoneToChampions,
          },
          { label: 'Dégats physiques infligés', data: physicalDamageDone },
          { label: 'Dégats physiques reçus', data: physicalDamageTaken },
          {
            label: 'Dégats physiques infligés aux champions',
            data: physicalDamageDoneToChampions,
          },
          { label: 'Dégats bruts infligés', data: trueDamageDone },
          { label: 'Dégats bruts reçus', data: trueDamageTaken },
          {
            label: 'Dégats bruts infligés aux champions',
            data: trueDamageDoneToChampions,
          },
        ],
      },
      options: {
        aspectRatio: 1,
        responsive: true,
        maintainAspectRatio: true,
        plugins: {},
      },
    });

    this.chart2 = new Chart(this.randomId2, {
      type: 'line',
      data: {
        // values on X-Axis
        labels: labels,
        datasets: [
          { label: 'Total des golds', data: totalGold },
          { label: 'Golds par seconde', data: goldPerSecond },
          {
            label: 'Golds actuels',
            data: currentGold,
          },
          {
            label: 'CS tués',
            data: minionsKilled,
          },
          {
            label: 'CS tués en jungle',
            data: jungleMinionsKilled,
          },
        ],
      },
      options: {
        aspectRatio: 1,
        responsive: true,
        maintainAspectRatio: true,
        plugins: {},
      },
    });

    this.chart3 = new Chart(this.randomId3, {
      type: 'line',
      data: {
        // values on X-Axis
        labels: labels,
        datasets: [
          { label: 'Total XP', data: xp },
          { label: 'Niveau', data: level },
        ],
      },
      options: {
        aspectRatio: 1,
        responsive: true,
        maintainAspectRatio: true,
        plugins: {},
      },
    });
  }
}
