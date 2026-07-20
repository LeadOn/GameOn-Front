import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  championIconUrl,
  frameStatsFor,
} from '../../../../shared/classes/lol/lol-match.util';
import {
  MAP_STRUCTURES,
  structureKeyForEvent,
} from '../../../../shared/classes/lol/lol-map-structures.util';
import {
  allTimelineEvents,
  findByPuuid,
  monsterIcon,
  monsterLabel,
} from '../../../../shared/classes/lol/lol-timeline-event.util';

interface MapDot {
  player: LoLGameParticipant;
  leftPercent: number;
  bottomPercent: number;
}

interface StructureDot {
  teamId: number;
  label: string;
  isInhibitor: boolean;
  destroyed: boolean;
  leftPercent: number;
  bottomPercent: number;
}

interface ObjectiveMarker {
  icon: string;
  label: string;
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

  private get currentTimestamp(): number {
    return this.currentFrame?.timestamp ?? 0;
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

  /** Static structures (turrets/inhibitors), greyed out once a matching BUILDING_KILL has happened. */
  get structures(): StructureDot[] {
    const time = this.currentTimestamp;
    const destroyedCounts = new Map<string, number>();

    for (const event of allTimelineEvents(this.timeline)) {
      if (event.eventType !== 'BUILDING_KILL' || event.timestamp > time) {
        continue;
      }
      const key = structureKeyForEvent(event);
      destroyedCounts.set(key, (destroyedCounts.get(key) ?? 0) + 1);
    }

    const usedPerKey = new Map<string, number>();

    return MAP_STRUCTURES.map((structure) => {
      const used = usedPerKey.get(structure.key) ?? 0;
      usedPerKey.set(structure.key, used + 1);

      return {
        teamId: structure.teamId,
        label: structure.label,
        isInhibitor: structure.isInhibitor,
        destroyed: used < (destroyedCounts.get(structure.key) ?? 0),
        leftPercent: this.toPercent(structure.positionX),
        bottomPercent: this.toPercent(structure.positionY),
      };
    });
  }

  /** Dragons/Baron/Herald/Voracraves taken so far, at their real recorded position. */
  get objectiveMarkers(): ObjectiveMarker[] {
    const time = this.currentTimestamp;

    return allTimelineEvents(this.timeline)
      .filter(
        (event) =>
          event.eventType === 'ELITE_MONSTER_KILL' &&
          event.timestamp <= time &&
          event.positionX != null &&
          event.positionY != null,
      )
      .map((event) => ({
        icon: monsterIcon(event),
        label: monsterLabel(event),
        leftPercent: this.toPercent(event.positionX!),
        bottomPercent: this.toPercent(event.positionY!),
      }));
  }

  /**
   * Cumulative wards placed per team so far. The timeline API doesn't expose
   * ward positions (only creatorPUUID/wardType), so we can't plot them on the map —
   * this is the closest honest signal we can surface.
   */
  get wardCounts(): { blue: number; red: number } {
    const time = this.currentTimestamp;
    let blue = 0;
    let red = 0;

    for (const event of allTimelineEvents(this.timeline)) {
      if (event.eventType !== 'WARD_PLACED' || event.timestamp > time) {
        continue;
      }
      const creator = findByPuuid(this.players, event.creatorPUUID);
      if (creator?.teamId === 100) blue++;
      else if (creator?.teamId === 200) red++;
    }

    return { blue, red };
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

  structureClasses(structure: StructureDot): string {
    if (structure.destroyed) {
      return 'opacity-30 grayscale';
    }
    return structure.teamId === 100
      ? 'bg-mpGreen/85 ring-1 ring-black/30'
      : 'bg-mpRed/85 ring-1 ring-black/30';
  }

  structureTooltip(structure: StructureDot): string {
    const team = structure.teamId === 100 ? 'Équipe bleue' : 'Équipe rouge';
    const status = structure.destroyed ? ' (détruite)' : '';
    return `${team} — ${structure.label}${status}`;
  }
}
