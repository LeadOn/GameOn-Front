import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  championIconUrl,
  frameStatsFor,
} from '../../../../shared/classes/lol/lol-match.util';

interface MapDot {
  player: LoLGameParticipant;
  leftPercent: number;
  bottomPercent: number;
}

// Summoner's Rift world coordinates span roughly 0..14980 on both axes.
const MAP_SIZE = 14980;

@Component({
  selector: 'app-lol-game-minimap',
  standalone: false,
  templateUrl: './lol-game-minimap.component.html',
  styleUrl: './lol-game-minimap.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameMinimapComponent {
  @Input()
  timeline?: LoLGameTimelineFrame[];

  @Input()
  players: LoLGameParticipant[] = [];

  @Input()
  currentFrameIndex = 0;

  @Input()
  patch = '';

  get mapUrl(): string {
    return `https://ddragon.leagueoflegends.com/cdn/${this.patch}/img/map/map11.png`;
  }

  get currentFrame(): LoLGameTimelineFrame | undefined {
    return (this.timeline ?? [])[this.currentFrameIndex];
  }

  get dots(): MapDot[] {
    return this.players
      .map((player) => {
        const stats = frameStatsFor(this.currentFrame, player.puuid);
        if (stats == null) {
          return null;
        }

        return {
          player,
          leftPercent: this.toPercent(stats.positionX),
          bottomPercent: this.toPercent(stats.positionY),
        };
      })
      .filter((dot): dot is MapDot => dot != null);
  }

  private toPercent(value: number): number {
    return Math.min(100, Math.max(0, (value / MAP_SIZE) * 100));
  }

  championIconUrl(player: LoLGameParticipant): string {
    return championIconUrl(player.championName, this.patch);
  }

  teamBorderClass(player: LoLGameParticipant): string {
    return player.teamId === 100 ? 'border-mpGreen' : 'border-mpRed';
  }
}
