import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  formatCompact,
  formatFull,
  formatTimestamp,
  frameStatsFor,
  playerFullName,
} from '../../../../shared/classes/lol/lol-match.util';

const WIDTH = 800;
const HEIGHT = 220;

@Component({
  selector: 'app-lol-game-player-gold',
  standalone: false,
  templateUrl: './lol-game-player-gold.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGamePlayerGoldComponent implements OnChanges {
  @Input()
  player?: LoLGameParticipant;

  @Input()
  timeline?: LoLGameTimelineFrame[];

  width = WIDTH;
  height = HEIGHT;

  linePath = '';
  areaPath = '';
  endLabel = '';
  finalGoldLabel = '0';

  hoverIndex: number | null = null;

  private values: number[] = [];
  private points: { x: number; y: number }[] = [];

  ngOnChanges(): void {
    const frames = this.timeline ?? [];
    this.values = frames.map(
      (frame) => frameStatsFor(frame, this.player?.puuid)?.totalGold ?? 0,
    );
    this.hoverIndex = null;

    this.endLabel = frames.length
      ? formatTimestamp(frames[frames.length - 1].timestamp)
      : '00:00';
    this.finalGoldLabel = formatCompact(
      this.values[this.values.length - 1] ?? 0,
    );

    if (this.values.length < 2) {
      this.linePath = '';
      this.areaPath = '';
      this.points = [];
      return;
    }

    // Gold only ever grows, so the scale starts at 0 rather than at the min.
    const max = Math.max(...this.values, 1);
    this.points = this.values.map((value, index) => ({
      x: (index / (this.values.length - 1)) * WIDTH,
      y: HEIGHT - (value / max) * (HEIGHT - 8),
    }));

    this.linePath = this.points
      .map(
        (p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`,
      )
      .join(' ');
    this.areaPath = `${this.linePath} L${WIDTH},${HEIGHT} L0,${HEIGHT} Z`;
  }

  onChartMouseMove(event: MouseEvent): void {
    if (this.points.length === 0) {
      return;
    }

    const rect = (event.currentTarget as SVGSVGElement).getBoundingClientRect();
    const ratio = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );

    this.hoverIndex = Math.round(ratio * (this.points.length - 1));
  }

  onChartMouseLeave(): void {
    this.hoverIndex = null;
  }

  get hoverX(): number {
    return this.hoverIndex == null ? 0 : this.points[this.hoverIndex].x;
  }

  get hoverY(): number {
    return this.hoverIndex == null ? 0 : this.points[this.hoverIndex].y;
  }

  get hoverPercent(): number {
    return (this.hoverX / WIDTH) * 100;
  }

  get hoverTimeLabel(): string {
    if (this.hoverIndex == null || this.timeline == null) {
      return '';
    }

    return formatTimestamp(this.timeline[this.hoverIndex].timestamp);
  }

  get hoverValueLabel(): string {
    if (this.hoverIndex == null) {
      return '';
    }

    return `${formatFull(this.values[this.hoverIndex])} or`;
  }

  get playerLabel(): string {
    return this.player ? playerFullName(this.player) : '';
  }
}
