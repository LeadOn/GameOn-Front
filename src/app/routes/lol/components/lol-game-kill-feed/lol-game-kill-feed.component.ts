import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import { championIconUrl, formatTimestamp } from '../../../../shared/classes/lol/lol-match.util';
import {
  allTimelineEvents,
  describeEvent,
  KillFeedCategory,
  teamAccentTextClass,
  TimelineEventEntry,
} from '../../../../shared/classes/lol/lol-timeline-event.util';

type FeedFilter = 'all' | KillFeedCategory;

const VISIBLE_CATEGORIES: KillFeedCategory[] = ['kills', 'objectives', 'wards'];

@Component({
  selector: 'app-lol-game-kill-feed',
  standalone: false,
  templateUrl: './lol-game-kill-feed.component.html',
  styleUrl: './lol-game-kill-feed.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameKillFeedComponent {
  @Input()
  players: LoLGameParticipant[] = [];

  @Input()
  timeline?: LoLGameTimelineFrame[];

  @Input()
  patch = '';

  filter: FeedFilter = 'all';

  readonly filters: { key: FeedFilter; label: string }[] = [
    { key: 'all', label: 'Tout' },
    { key: 'kills', label: 'Éliminations' },
    { key: 'objectives', label: 'Objectifs' },
    { key: 'wards', label: 'Wards' },
  ];

  get entries(): TimelineEventEntry[] {
    const all = allTimelineEvents(this.timeline)
      .map((event) => describeEvent(event, this.players))
      .filter((entry) => VISIBLE_CATEGORIES.includes(entry.category));

    if (this.filter === 'all') {
      return all;
    }

    return all.filter((entry) => entry.category === this.filter);
  }

  setFilter(filter: FeedFilter): void {
    this.filter = filter;
  }

  timeLabel(entry: TimelineEventEntry): string {
    return formatTimestamp(entry.event.timestamp);
  }

  championIconUrl(player?: LoLGameParticipant): string {
    return championIconUrl(player?.championName, this.patch);
  }

  accentClass(entry: TimelineEventEntry): string {
    return teamAccentTextClass(entry.teamId);
  }

  displayName(player?: LoLGameParticipant): string {
    return player?.riotIdGameName ?? 'Inconnu';
  }
}
