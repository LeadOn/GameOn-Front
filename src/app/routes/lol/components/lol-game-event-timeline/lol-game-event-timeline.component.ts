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
import { formatTimestamp } from '../../../../shared/classes/lol/lol-match.util';
import {
  allTimelineEvents,
  describeEvent,
  KillFeedCategory,
  TimelineEventEntry,
} from '../../../../shared/classes/lol/lol-timeline-event.util';

interface Marker {
  entry: TimelineEventEntry;
  leftPercent: number;
  frameIndex: number;
}

const VISIBLE_CATEGORIES: KillFeedCategory[] = ['kills', 'objectives'];

const CATEGORY_DOT_CLASS: Record<KillFeedCategory, string> = {
  kills: 'bg-mpRed',
  objectives: 'bg-mpYellow',
  wards: 'bg-mpBlue',
  other: 'bg-mpTextMuted',
};

// How long (ms of wall-clock) it takes to play through one real timeline frame (~1 in-game minute).
const MS_PER_FRAME = 800;

@Component({
  selector: 'app-lol-game-event-timeline',
  standalone: false,
  templateUrl: './lol-game-event-timeline.component.html',
  styleUrl: './lol-game-event-timeline.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameEventTimelineComponent implements OnDestroy {
  @Input()
  timeline?: LoLGameTimelineFrame[];

  @Input()
  players: LoLGameParticipant[] = [];

  @Input()
  currentFrameIndex = 0;

  @Output()
  currentFrameIndexChange = new EventEmitter<number>();

  @Output()
  playProgressChange = new EventEmitter<number>();

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

  private get durationMs(): number {
    const last = this.frames.at(-1)?.timestamp ?? 0;
    return last > 0 ? last : 1;
  }

  get markers(): Marker[] {
    return allTimelineEvents(this.timeline)
      .map((event) => describeEvent(event, this.players))
      .filter((entry) => VISIBLE_CATEGORIES.includes(entry.category))
      .map((entry) => ({
        entry,
        leftPercent: Math.min(
          100,
          (entry.event.timestamp / this.durationMs) * 100,
        ),
        frameIndex: this.nearestFrameIndex(entry.event.timestamp),
      }));
  }

  get endLabel(): string {
    return formatTimestamp(this.frames.at(-1)?.timestamp ?? 0);
  }

  get playheadPercent(): number {
    const frame = this.frames[this.currentFrameIndex];
    if (frame == null) {
      return 0;
    }
    return Math.min(100, (frame.timestamp / this.durationMs) * 100);
  }

  private nearestFrameIndex(timestamp: number): number {
    let bestIndex = 0;
    let bestDiff = Infinity;

    this.frames.forEach((frame, index) => {
      const diff = Math.abs(frame.timestamp - timestamp);
      if (diff < bestDiff) {
        bestDiff = diff;
        bestIndex = index;
      }
    });

    return bestIndex;
  }

  dotClass(marker: Marker): string {
    return CATEGORY_DOT_CLASS[marker.entry.category];
  }

  tooltipFor(marker: Marker): string {
    const killerName = marker.entry.killer?.riotIdGameName ?? '';
    const victimName = marker.entry.victim?.riotIdGameName ?? '';
    const time = formatTimestamp(marker.entry.event.timestamp);
    return victimName
      ? `${time} — ${killerName} ${marker.entry.label} ${victimName}`
      : `${time} — ${killerName} ${marker.entry.label}`;
  }

  selectMarker(marker: Marker, event: MouseEvent): void {
    event.stopPropagation();
    this.stopPlay();
    this.currentFrameIndex = marker.frameIndex;
    this.currentFrameIndexChange.emit(marker.frameIndex);
  }

  onTrackClick(event: MouseEvent): void {
    if (this.frames.length < 2) {
      return;
    }

    this.stopPlay();

    const track = event.currentTarget as HTMLElement;
    const rect = track.getBoundingClientRect();
    const percent = Math.min(
      1,
      Math.max(0, (event.clientX - rect.left) / rect.width),
    );
    const index = this.nearestFrameIndex(percent * this.durationMs);
    this.currentFrameIndex = index;
    this.currentFrameIndexChange.emit(index);
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
      this.playProgressChange.emit(0);
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
    this.playProgressChange.emit(this.playProgress);
    this.rafId = requestAnimationFrame(this.tick);
  };

  stopPlay(): void {
    if (!this.isPlaying) {
      return;
    }

    this.isPlaying = false;
    this.playProgress = 0;
    this.playProgressChange.emit(0);

    if (this.rafId != null) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
  }

  ngOnDestroy(): void {
    this.stopPlay();
  }
}
