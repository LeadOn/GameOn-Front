import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { faPause, faPlay } from '@fortawesome/free-solid-svg-icons';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  championIconUrl,
  formatTimestamp,
  frameStatsFor,
} from '../../../../shared/classes/lol/lol-match.util';

interface RaceRow {
  player: LoLGameParticipant;
  value: number;
  rank: number;
  widthPercent: number;
}

// How long (ms of wall-clock) it takes to play through one real timeline frame (~1 in-game minute).
const MS_PER_FRAME = 800;

@Component({
  selector: 'app-lol-game-gold-race',
  standalone: false,
  templateUrl: './lol-game-gold-race.component.html',
  styleUrl: './lol-game-gold-race.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameGoldRaceComponent implements OnDestroy {
  @Input()
  timeline?: LoLGameTimelineFrame[];

  @Input()
  team1: LoLGameParticipant[] = [];

  @Input()
  team2: LoLGameParticipant[] = [];

  @Input()
  patch = '';

  @Input()
  currentFrameIndex = 0;

  @Output()
  currentFrameIndexChange = new EventEmitter<number>();

  readonly rowHeight = 40;
  readonly playIcon = faPlay;
  readonly pauseIcon = faPause;

  isPlaying = false;
  /** Fractional progress towards the frame after currentFrameIndex, 0 when not playing. */
  playProgress = 0;

  private rafId?: number;
  private playStartTime = 0;
  private playStartIndex = 0;

  get frames(): LoLGameTimelineFrame[] {
    return this.timeline ?? [];
  }

  get currentFrame(): LoLGameTimelineFrame | undefined {
    return this.frames[this.currentFrameIndex];
  }

  private get nextFrame(): LoLGameTimelineFrame | undefined {
    return this.frames[this.currentFrameIndex + 1];
  }

  get currentTimeLabel(): string {
    const base = this.currentFrame?.timestamp ?? 0;
    const next = this.nextFrame?.timestamp ?? base;
    return formatTimestamp(base + (next - base) * this.playProgress);
  }

  get rows(): RaceRow[] {
    const frame = this.currentFrame;
    if (frame == null) {
      return [];
    }

    const next = this.nextFrame;
    const t = this.playProgress;

    const rows = [...this.team1, ...this.team2].map((player) => {
      const base = frameStatsFor(frame, player.puuid)?.totalGold ?? 0;
      const target = next
        ? (frameStatsFor(next, player.puuid)?.totalGold ?? base)
        : base;

      return { player, value: base + (target - base) * t };
    });

    rows.sort((a, b) => b.value - a.value);

    const max = rows.reduce((m, r) => Math.max(m, r.value), 0) || 1;

    return rows.map((r, index) => ({
      ...r,
      rank: index,
      widthPercent: Math.max(4, (r.value / max) * 100),
    }));
  }

  championIconUrl(player: LoLGameParticipant): string {
    return championIconUrl(player.championName, this.patch);
  }

  onSliderInput(event: Event): void {
    this.stopPlay();
    const value = Number((event.target as HTMLInputElement).value);
    this.currentFrameIndex = value;
    this.currentFrameIndexChange.emit(value);
  }

  togglePlay(): void {
    if (this.isPlaying) {
      this.stopPlay();
      return;
    }

    if (this.frames.length <= 1) {
      return;
    }

    if (this.currentFrameIndex >= this.frames.length - 1) {
      this.currentFrameIndex = 0;
      this.currentFrameIndexChange.emit(0);
    }

    this.isPlaying = true;
    this.playStartTime = performance.now();
    this.playStartIndex = this.currentFrameIndex;
    this.rafId = requestAnimationFrame(this.tick);
  }

  private tick = (now: number): void => {
    if (!this.isPlaying) {
      return;
    }

    const framesElapsed = (now - this.playStartTime) / MS_PER_FRAME;
    const targetIndex = this.playStartIndex + Math.floor(framesElapsed);

    if (targetIndex >= this.frames.length - 1) {
      this.playProgress = 0;
      if (this.currentFrameIndex !== this.frames.length - 1) {
        this.currentFrameIndex = this.frames.length - 1;
        this.currentFrameIndexChange.emit(this.currentFrameIndex);
      }
      this.stopPlay();
      return;
    }

    if (targetIndex !== this.currentFrameIndex) {
      this.currentFrameIndex = targetIndex;
      this.currentFrameIndexChange.emit(targetIndex);
    }

    this.playProgress = framesElapsed - Math.floor(framesElapsed);
    this.rafId = requestAnimationFrame(this.tick);
  };

  stopPlay(): void {
    this.isPlaying = false;
    this.playProgress = 0;

    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
  }

  ngOnDestroy(): void {
    this.stopPlay();
  }
}
