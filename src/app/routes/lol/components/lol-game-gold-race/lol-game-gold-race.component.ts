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

const FRAME_INTERVAL_MS = 300;

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
  private intervalId?: ReturnType<typeof setInterval>;

  get frames(): LoLGameTimelineFrame[] {
    return this.timeline ?? [];
  }

  get currentFrame(): LoLGameTimelineFrame | undefined {
    return this.frames[this.currentFrameIndex];
  }

  get currentTimeLabel(): string {
    return formatTimestamp(this.currentFrame?.timestamp ?? 0);
  }

  get rows(): RaceRow[] {
    const frame = this.currentFrame;
    if (frame == null) {
      return [];
    }

    const rows = [...this.team1, ...this.team2].map((player) => ({
      player,
      value: frameStatsFor(frame, player.puuid)?.totalGold ?? 0,
    }));

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
    this.intervalId = setInterval(() => {
      const next = this.currentFrameIndex + 1;

      if (next >= this.frames.length) {
        this.stopPlay();
        return;
      }

      this.currentFrameIndex = next;
      this.currentFrameIndexChange.emit(next);
    }, FRAME_INTERVAL_MS);
  }

  stopPlay(): void {
    this.isPlaying = false;

    if (this.intervalId != null) {
      clearInterval(this.intervalId);
      this.intervalId = undefined;
    }
  }

  ngOnDestroy(): void {
    this.stopPlay();
  }
}
