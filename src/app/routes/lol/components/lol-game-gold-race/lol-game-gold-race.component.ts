import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  championIconUrl,
  frameStatsFor,
} from '../../../../shared/classes/lol/lol-match.util';

interface RaceRow {
  player: LoLGameParticipant;
  value: number;
  rank: number;
  widthPercent: number;
}

@Component({
  selector: 'app-lol-game-gold-race',
  standalone: false,
  templateUrl: './lol-game-gold-race.component.html',
  styleUrl: './lol-game-gold-race.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameGoldRaceComponent {
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

  /** Fractional progress towards the frame after currentFrameIndex, driven by the shared event-timeline playhead. */
  @Input()
  playProgress = 0;

  readonly rowHeight = 40;

  get frames(): LoLGameTimelineFrame[] {
    return this.timeline ?? [];
  }

  get currentFrame(): LoLGameTimelineFrame | undefined {
    return this.frames[this.currentFrameIndex];
  }

  private get nextFrame(): LoLGameTimelineFrame | undefined {
    return this.frames[this.currentFrameIndex + 1];
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
}
