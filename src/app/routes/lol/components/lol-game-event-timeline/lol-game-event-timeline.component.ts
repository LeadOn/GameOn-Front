import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
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

@Component({
  selector: 'app-lol-game-event-timeline',
  standalone: false,
  templateUrl: './lol-game-event-timeline.component.html',
  styleUrl: './lol-game-event-timeline.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameEventTimelineComponent {
  @Input()
  timeline?: LoLGameTimelineFrame[];

  @Input()
  players: LoLGameParticipant[] = [];

  @Input()
  currentFrameIndex = 0;

  @Output()
  currentFrameIndexChange = new EventEmitter<number>();

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

  selectMarker(marker: Marker): void {
    this.currentFrameIndex = marker.frameIndex;
    this.currentFrameIndexChange.emit(marker.frameIndex);
  }
}
