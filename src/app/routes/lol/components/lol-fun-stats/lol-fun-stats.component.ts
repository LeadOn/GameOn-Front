import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { GameOnLoLService } from '../../../../shared/services/leagueoflegends/gameon-lol.service';
import {
  LoLGlobalStatAwardKey,
  LoLGlobalStatsDto,
  LoLQueueFilter,
  LoLStatsPeriod,
} from '../../../../shared/classes/lol/LoLGlobalStats';
import {
  LOL_DISPLAY_TIMEZONE,
  parseApiDate,
} from '../../../../shared/classes/lol/lol-match.util';
import { environment } from '../../../../../environments/environment';

type LoLFunStatAccent = 'blue' | 'red' | 'green' | 'gold' | 'purple' | 'pink';

interface AwardConfig {
  key: LoLGlobalStatAwardKey;
  icon: string;
  accent: LoLFunStatAccent;
  title: string;
  description: string;
  unit: string;
  decimals: number;
}

const AWARDS: AwardConfig[] = [
  {
    key: 'pingMachine',
    icon: '🎯',
    accent: 'blue',
    title: 'Ping Machine',
    description: 'Le plus de pings envoyés en une game',
    unit: 'pings',
    decimals: 0,
  },
  {
    key: 'biggestInter',
    icon: '💀',
    accent: 'red',
    title: 'Biggest Inter',
    description: 'Le plus de morts en une game',
    unit: 'morts',
    decimals: 0,
  },
  {
    key: 'highestBounty',
    icon: '🏆',
    accent: 'gold',
    title: 'Highest Bounty',
    description: 'La plus grosse prime encaissée par un ennemi sur sa tête',
    unit: 'golds de prime',
    decimals: 0,
  },
  {
    key: 'shoppingAddict',
    icon: '🛒',
    accent: 'blue',
    title: 'Shopping Addict',
    description: 'Le plus de consommables achetés en une game',
    unit: 'consommables',
    decimals: 0,
  },
  {
    key: 'oneTrickPony',
    icon: '🐴',
    accent: 'green',
    title: 'One-Trick Pony',
    description:
      '% le plus élevé de games sur un seul champion (min. 10 games)',
    unit: '% des games',
    decimals: 1,
  },
  {
    key: 'crowdControlMaster',
    icon: '🌀',
    accent: 'purple',
    title: 'Crowd Control Master',
    description: 'Le plus de temps de CC infligé aux ennemis',
    unit: 'sec. de CC',
    decimals: 0,
  },
  {
    key: 'punchingBall',
    icon: '🥊',
    accent: 'pink',
    title: 'Punching Ball',
    description: 'Le plus de dégâts subis par minute',
    unit: 'dégâts/min',
    decimals: 0,
  },
  {
    key: 'pacifist',
    icon: '🕊️',
    accent: 'green',
    title: 'Pacifist',
    description: 'Le moins de dégâts infligés aux champions sur une game',
    unit: 'dégâts',
    decimals: 0,
  },
  {
    key: 'squirrel',
    icon: '🐿️',
    accent: 'gold',
    title: 'Squirrel',
    description: "Le plus d'or non dépensé en fin de game",
    unit: 'golds',
    decimals: 0,
  },
  {
    key: 'jungleThief',
    icon: '🐒',
    accent: 'green',
    title: 'Jungle Thief',
    description: 'Le plus de monstres jungle tués sans être le jungler',
    unit: 'monstres',
    decimals: 0,
  },
  {
    key: 'comebackKing',
    icon: '👑',
    accent: 'gold',
    title: 'Comeback King',
    description: 'Le plus de victoires en étant derrière en or à 20 min',
    unit: 'comebacks',
    decimals: 0,
  },
  {
    key: 'nightOwl',
    icon: '🦉',
    accent: 'blue',
    title: 'Night Owl',
    description: 'Le plus de games jouées entre minuit et 6h',
    unit: 'games',
    decimals: 0,
  },
  {
    key: 'longestLossStreak',
    icon: '📉',
    accent: 'red',
    title: 'Longest Loss Streak',
    description: 'La plus longue série de défaites consécutives',
    unit: 'défaites',
    decimals: 0,
  },
  {
    key: 'emotionalElevator',
    icon: '🎢',
    accent: 'pink',
    title: 'Emotional Elevator',
    description: 'La plus grosse chute de LP entre deux relevés',
    unit: 'LP perdus',
    decimals: 0,
  },
  {
    key: 'cursedPatch',
    icon: '☠️',
    accent: 'purple',
    title: 'Cursed Patch',
    description:
      'Patch avec le pire winrate tous joueurs confondus (min. 10 games)',
    unit: '% winrate',
    decimals: 1,
  },
];

const ICON_CLASSES: Record<LoLFunStatAccent, string> = {
  blue: 'bg-secondary/15 text-secondary',
  red: 'bg-customRed/15 text-customRed',
  green: 'bg-customGreen/15 text-customGreen',
  gold: 'bg-customYellow/15 text-customYellow',
  purple: 'bg-purple-500/15 text-purple-400',
  pink: 'bg-pink-500/15 text-pink-400',
};

const VALUE_CLASSES: Record<LoLFunStatAccent, string> = {
  blue: 'text-secondary',
  red: 'text-customRed',
  green: 'text-customGreen',
  gold: 'text-customYellow',
  purple: 'text-purple-400',
  pink: 'text-pink-400',
};

const QUEUE_OPTIONS: { value: LoLQueueFilter; label: string }[] = [
  { value: 'All', label: 'Toutes' },
  { value: 'Solo', label: 'Solo/Duo' },
  { value: 'Flex', label: 'Flex' },
];

const PERIOD_OPTIONS: { value: LoLStatsPeriod; label: string }[] = [
  { value: 'AllTime', label: 'Depuis toujours' },
  { value: 'Week', label: '7 derniers jours' },
  { value: 'Month', label: '1 mois' },
  { value: 'ThreeMonths', label: '3 mois' },
  { value: 'SixMonths', label: '6 mois' },
];

function isQueueFilter(value: string | null): value is LoLQueueFilter {
  return value === 'All' || value === 'Solo' || value === 'Flex';
}

function isStatsPeriod(value: string | null): value is LoLStatsPeriod {
  return (
    value === 'AllTime' ||
    value === 'Week' ||
    value === 'Month' ||
    value === 'ThreeMonths' ||
    value === 'SixMonths'
  );
}

// Defaults are scoped to Solo/Duo over the last 7 days rather than the full
// all-time/all-queues dataset: computing every award (biggest inter, cursed
// patch, ...) across the whole history is by far the heaviest query this page
// can trigger, so a fresh load stays cheap unless the user opts into more.
const DEFAULT_QUEUE: LoLQueueFilter = 'Solo';
const DEFAULT_PERIOD: LoLStatsPeriod = 'Week';

@Component({
  selector: 'app-lol-fun-stats',
  templateUrl: './lol-fun-stats.component.html',
  styleUrl: './lol-fun-stats.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LolFunStatsComponent implements OnInit {
  awards = AWARDS;
  skeletonAwards = AWARDS.slice(0, 6);
  queueOptions = QUEUE_OPTIONS;
  periodOptions = PERIOD_OPTIONS;
  apiUrl = environment.gameOnApiUrl;
  currentLoLPatch = '';
  displayTimezone = LOL_DISPLAY_TIMEZONE;

  queue: LoLQueueFilter = DEFAULT_QUEUE;
  period: LoLStatsPeriod = DEFAULT_PERIOD;
  rankedOnly = false;

  summary: LoLGlobalStatsDto | null = null;
  isLoading = true;
  hasError = false;

  constructor(
    private lolService: GameOnLoLService,
    private lolVersionStore: Store<{ lolVersion: string }>,
    private route: ActivatedRoute,
    private router: Router,
  ) {
    this.lolVersionStore
      .select('lolVersion')
      .subscribe((v) => (this.currentLoLPatch = v));

    const params = this.route.snapshot.queryParamMap;
    const queueParam = params.get('queue');
    const periodParam = params.get('period');

    if (isQueueFilter(queueParam)) {
      this.queue = queueParam;
    }

    if (isStatsPeriod(periodParam)) {
      this.period = periodParam;
    }

    this.rankedOnly = params.get('rankedOnly') === 'true';
  }

  ngOnInit(): void {
    this.load();
  }

  get rankedOnlyLocked(): boolean {
    return this.queue !== 'All';
  }

  get rankedOnlyDisplay(): boolean {
    return this.rankedOnlyLocked ? true : this.rankedOnly;
  }

  get hasNoGames(): boolean {
    return this.summary != null && this.summary.totalGamesAnalyzed === 0;
  }

  setQueue(queue: LoLQueueFilter): void {
    if (this.queue === queue) {
      return;
    }

    this.queue = queue;
    this.applyFilterChange();
  }

  onPeriodChange(event: Event): void {
    const value = (event.target as HTMLSelectElement).value as LoLStatsPeriod;
    this.period = value;
    this.applyFilterChange();
  }

  onRankedOnlyChange(event: Event): void {
    this.rankedOnly = (event.target as HTMLInputElement).checked;
    this.applyFilterChange();
  }

  private applyFilterChange(): void {
    this.syncUrl();
    this.load();
  }

  private syncUrl(): void {
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {
        queue: this.queue !== DEFAULT_QUEUE ? this.queue : null,
        period: this.period !== DEFAULT_PERIOD ? this.period : null,
        rankedOnly: this.queue === 'All' && this.rankedOnly ? 'true' : null,
      },
      replaceUrl: true,
    });
  }

  load(): void {
    this.isLoading = true;
    this.hasError = false;

    this.lolService
      .getGlobalStats({
        queue: this.queue,
        period: this.period,
        rankedOnly: this.queue === 'All' && this.rankedOnly,
      })
      .subscribe({
        next: (summary) => {
          this.summary = summary;
          this.isLoading = false;
        },
        error: (err) => {
          console.error(err);
          this.hasError = true;
          this.isLoading = false;
        },
      });
  }

  statFor(award: AwardConfig): LoLGlobalStatsDto[LoLGlobalStatAwardKey] {
    return this.summary == null ? null : this.summary[award.key];
  }

  /** `gameDate` comes back as a naive (offset-less, actually UTC) string — see {@link parseApiDate}. */
  gameDate(gameDate: string): Date {
    return parseApiDate(gameDate);
  }

  iconClass(accent: LoLFunStatAccent): string {
    return ICON_CLASSES[accent];
  }

  valueClass(accent: LoLFunStatAccent): string {
    return VALUE_CLASSES[accent];
  }
}
