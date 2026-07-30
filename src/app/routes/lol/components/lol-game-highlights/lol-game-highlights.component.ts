import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  bestParticipant,
  championIconUrl,
  crowdControlSecondsFor,
  csFor,
  csPerMinute,
  isLinkedToGameOn,
  latestStatsFor,
  playerDisplayName,
} from '../../../../shared/classes/lol/lol-match.util';
import { maxBountyOnHead } from '../../../../shared/classes/lol/lol-timeline-event.util';

type Accent = 'green' | 'red' | 'blue' | 'yellow';

interface HighlightConfig {
  key: string;
  icon: string;
  title: string;
  subtitle: string;
  accent: Accent;
  valueFn: (
    player: LoLGameParticipant,
    timeline: LoLGameTimelineFrame[] | undefined,
    durationSeconds: number,
  ) => number;
  formatFn: (value: number) => string;
}

const CONFIGS: HighlightConfig[] = [
  {
    key: 'pingMachine',
    icon: '📍',
    title: 'La Ping Machine',
    subtitle: 'Pings envoyés (all-in, aidez-moi, commandes)',
    accent: 'blue',
    valueFn: (p) => p.allInPings + p.assistMePings + p.commandPings,
    formatFn: (v) => v.toFixed(0),
  },
  {
    key: 'punchingBall',
    icon: '🥊',
    title: 'Le Punching-Ball',
    subtitle: 'Dégâts encaissés',
    accent: 'red',
    valueFn: (p, timeline) =>
      latestStatsFor(timeline, p.puuid)?.totalDamageTaken ?? 0,
    formatFn: (v) => (v >= 1000 ? (v / 1000).toFixed(1) + 'k' : v.toFixed(0)),
  },
  {
    key: 'ccMaster',
    icon: '🌀',
    title: 'Maître du CC',
    subtitle: 'Temps de contrôle infligé',
    accent: 'blue',
    valueFn: (p, timeline) => crowdControlSecondsFor(p, timeline),
    formatFn: (v) => v.toFixed(0) + 's',
  },
  {
    key: 'shoppingAddict',
    icon: '🛍️',
    title: 'Shopping Addict',
    subtitle: 'Consommables achetés',
    accent: 'yellow',
    valueFn: (p) => p.consumablesPurchased,
    formatFn: (v) => v.toFixed(0),
  },
  {
    key: 'bounty',
    icon: '💰',
    title: 'Tête mise à prix',
    subtitle: 'Prime la plus élevée collectée en le tuant',
    accent: 'yellow',
    valueFn: (p, timeline) => maxBountyOnHead(timeline, p.puuid),
    formatFn: (v) => `${v.toFixed(0)}`,
  },
  {
    key: 'reaper',
    icon: '🌾',
    title: 'La Faucheuse',
    subtitle: 'Meilleur CS/min',
    accent: 'green',
    valueFn: (p, timeline, durationSeconds) =>
      csPerMinute(csFor(timeline, p.puuid), durationSeconds),
    formatFn: (v) => v.toFixed(1),
  },
];

const ACCENT_CLASSES: Record<Accent, { chip: string; value: string }> = {
  green: { chip: 'bg-mpGreen/15 text-mpGreenInk', value: 'text-mpGreenInk' },
  red: { chip: 'bg-mpRed/15 text-mpRedInk', value: 'text-mpRedInk' },
  blue: { chip: 'bg-mpBlue/15 text-mpBlueInk', value: 'text-mpBlueInk' },
  yellow: {
    chip: 'bg-mpYellow/15 text-mpYellowInk',
    value: 'text-mpYellowInk',
  },
};

interface HighlightCard {
  config: HighlightConfig;
  player?: LoLGameParticipant;
  value: number;
}

@Component({
  selector: 'app-lol-game-highlights',
  standalone: false,
  templateUrl: './lol-game-highlights.component.html',
  styleUrl: './lol-game-highlights.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameHighlightsComponent {
  @Input()
  players: LoLGameParticipant[] = [];

  @Input()
  timeline?: LoLGameTimelineFrame[];

  @Input()
  durationSeconds = 0;

  @Input()
  patch = '';

  get cards(): HighlightCard[] {
    return CONFIGS.map((config) => {
      const best = bestParticipant(this.players, (p) =>
        config.valueFn(p, this.timeline, this.durationSeconds),
      );
      return { config, player: best?.player, value: best?.value ?? 0 };
    });
  }

  formattedValue(card: HighlightCard): string {
    return card.config.formatFn(card.value);
  }

  chipClass(card: HighlightCard): string {
    return ACCENT_CLASSES[card.config.accent].chip;
  }

  valueClass(card: HighlightCard): string {
    return ACCENT_CLASSES[card.config.accent].value;
  }

  displayName(player?: LoLGameParticipant): string {
    return player ? playerDisplayName(player) : '';
  }

  isLinked(player?: LoLGameParticipant): boolean {
    return player != null && isLinkedToGameOn(player);
  }

  championIconUrl(player?: LoLGameParticipant): string {
    return championIconUrl(player?.championName, this.patch);
  }
}
