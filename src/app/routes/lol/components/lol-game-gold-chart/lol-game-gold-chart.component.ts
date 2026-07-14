import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  formatCompact,
  formatTimestamp,
  frameStatsFor,
} from '../../../../shared/classes/lol/lol-match.util';

const WIDTH = 800;
const HEIGHT = 220;

@Component({
  selector: 'app-lol-game-gold-chart',
  standalone: false,
  templateUrl: './lol-game-gold-chart.component.html',
  styleUrl: './lol-game-gold-chart.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameGoldChartComponent {
  @Input()
  timeline?: LoLGameTimelineFrame[];

  @Input()
  team1: LoLGameParticipant[] = [];

  @Input()
  team2: LoLGameParticipant[] = [];

  @Input()
  selectedPlayer?: LoLGameParticipant;

  @Input()
  currentFrameIndex = 0;

  @Input()
  mode: 'team' | 'player' = 'team';

  readonly width = WIDTH;
  readonly height = HEIGHT;
  readonly midY = HEIGHT / 2;

  get frames(): LoLGameTimelineFrame[] {
    return this.timeline ?? [];
  }

  get series(): number[] {
    if (this.mode == 'team') {
      return this.frames.map((frame) => {
        const gold1 = this.team1.reduce(
          (sum, p) => sum + (frameStatsFor(frame, p.puuid)?.totalGold ?? 0),
          0,
        );
        const gold2 = this.team2.reduce(
          (sum, p) => sum + (frameStatsFor(frame, p.puuid)?.totalGold ?? 0),
          0,
        );
        return gold1 - gold2;
      });
    }

    return this.frames.map(
      (frame) =>
        frameStatsFor(frame, this.selectedPlayer?.puuid)?.totalGold ?? 0,
    );
  }

  private xFor(index: number): number {
    const count = this.frames.length;
    if (count <= 1) {
      return 0;
    }

    return (index / (count - 1)) * this.width;
  }

  private get scale(): number {
    const values = this.series;

    if (this.mode == 'team') {
      const max = Math.max(1, ...values.map((v) => Math.abs(v)));
      return (this.midY - 12) / max;
    }

    const max = Math.max(1, ...values);
    return (this.height - 16) / max;
  }

  private yFor(value: number): number {
    if (this.mode == 'team') {
      return this.midY - value * this.scale;
    }

    return this.height - 6 - value * this.scale;
  }

  get linePath(): string {
    const values = this.series;
    if (values.length == 0) {
      return '';
    }

    return values
      .map((v, i) => `${i == 0 ? 'M' : 'L'} ${this.xFor(i)},${this.yFor(v)}`)
      .join(' ');
  }

  get areaPath(): string {
    const values = this.series;
    if (values.length == 0) {
      return '';
    }

    const baseline = this.mode == 'team' ? this.midY : this.height;
    const first = `M ${this.xFor(0)},${baseline}`;
    const line = values
      .map((v, i) => `L ${this.xFor(i)},${this.yFor(v)}`)
      .join(' ');
    const last = `L ${this.xFor(values.length - 1)},${baseline}`;

    return `${first} ${line} ${last} Z`;
  }

  get playheadX(): number {
    return this.xFor(this.currentFrameIndex);
  }

  get startLabel(): string {
    return '00:00';
  }

  get endLabel(): string {
    const last = this.frames.at(-1);
    return last ? formatTimestamp(last.timestamp) : '00:00';
  }

  get centerLabel(): string {
    const values = this.series;
    if (values.length == 0) {
      return '';
    }

    const last = values.at(-1) ?? 0;

    if (this.mode == 'team') {
      const side = last >= 0 ? 'équipe bleue' : 'équipe rouge';
      return `${formatCompact(Math.abs(last))} pour l'${side}`;
    }

    return `${formatCompact(last)} d'or en fin de partie`;
  }
}
