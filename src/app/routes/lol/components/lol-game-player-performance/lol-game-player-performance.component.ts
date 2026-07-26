import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  championIconUrl,
  creepScoreFor,
  damageToChampionsFor,
  decimalLabel,
  formatCompact,
  goldEarnedFor,
  itemIconUrl,
  itemSlots,
  kda,
  kdaLabel,
  killParticipationFor,
  latestStatsFor,
  playerFullName,
  playerRating,
  ratingToneClass,
} from '../../../../shared/classes/lol/lol-match.util';
import { roleLabel } from '../../../../shared/classes/lol/lol-role.util';

interface StatTile {
  label: string;
  value: string;
  detail: string;
}

@Component({
  selector: 'app-lol-game-player-performance',
  standalone: false,
  templateUrl: './lol-game-player-performance.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGamePlayerPerformanceComponent implements OnChanges {
  @Input()
  player?: LoLGameParticipant;

  @Input()
  players: LoLGameParticipant[] = [];

  @Input()
  timeline?: LoLGameTimelineFrame[];

  @Input()
  patch = '';

  @Input()
  durationSeconds = 0;

  tiles: StatTile[] = [];
  rating = 0;
  ratingRankLabel = '';

  /** Every tile carries a rank, so all of it is recomputed per input change. */
  ngOnChanges(): void {
    if (this.player == null) {
      this.tiles = [];
      this.rating = 0;
      this.ratingRankLabel = '';
      return;
    }

    const player = this.player;

    this.rating = this.ratingOf(player);
    this.ratingRankLabel = this.rankLabel(player, (p) => this.ratingOf(p));

    this.tiles = [
      {
        label: 'KDA',
        value: kdaLabel(player),
        detail: `${player.kills} / ${player.deaths} / ${player.assists} · ${this.rankLabel(player, (p) => kda(p))}`,
      },
      {
        label: 'Participation',
        value: `${this.killParticipation(player)}%`,
        detail: `des kills de son équipe · ${this.rankLabel(player, (p) => this.killParticipation(p))}`,
      },
      {
        label: 'CS / min',
        value: decimalLabel(this.csPerMinute(player), 1),
        detail: `${creepScoreFor(player, this.timeline)} CS au total · ${this.rankLabel(player, (p) => this.csPerMinute(p))}`,
      },
      {
        label: 'Or / min',
        value: Math.round(this.goldPerMinute(player)).toString(),
        detail: `${formatCompact(goldEarnedFor(player, this.timeline))} au total · ${this.rankLabel(player, (p) => this.goldPerMinute(p))}`,
      },
      {
        label: 'Dégâts / min',
        value: Math.round(this.damagePerMinute(player)).toString(),
        detail: `${formatCompact(damageToChampionsFor(player, this.timeline))} infligés · ${this.rankLabel(player, (p) => this.damagePerMinute(p))}`,
      },
      {
        label: 'Dégâts subis',
        value: formatCompact(this.damageTaken(player)),
        detail: `${this.rankLabel(player, (p) => this.damageTaken(p))} le plus ciblé`,
      },
      {
        label: 'Wards posées',
        value: this.wardsPlaced(player).toString(),
        detail: `vision ${player.visionScore} · ${this.rankLabel(player, (p) => this.wardsPlaced(p))}`,
      },
      {
        label: 'Contrôle infligé',
        value: `${this.crowdControl(player)}s`,
        detail: `${this.rankLabel(player, (p) => this.crowdControl(p))} · ${this.pings(player)} pings envoyés`,
      },
    ];
  }

  /**
   * 1-based position among the lobby, best first — "1er / 10", "2e / 10".
   * Every metric here is better when higher (being the most-targeted player is
   * phrased as such in its own label rather than inverted).
   */
  private rankLabel(
    player: LoLGameParticipant,
    valueFn: (p: LoLGameParticipant) => number,
  ): string {
    const ranked = [...this.players].sort((a, b) => valueFn(b) - valueFn(a));
    const position = ranked.findIndex((p) => p.puuid === player.puuid) + 1;

    if (position === 0) {
      return '';
    }

    return `${position === 1 ? '1er' : position + 'e'} / ${this.players.length}`;
  }

  private get minutes(): number {
    const seconds =
      this.durationSeconds || (this.player?.stats?.gameDurationSeconds ?? 0);
    return seconds > 0 ? seconds / 60 : 0;
  }

  private teamOf(player: LoLGameParticipant): LoLGameParticipant[] {
    return this.players.filter((p) => p.teamId === player.teamId);
  }

  private ratingOf(player: LoLGameParticipant): number {
    return playerRating(
      player,
      this.teamOf(player),
      this.timeline,
      this.durationSeconds || (player.stats?.gameDurationSeconds ?? 0),
    );
  }

  private killParticipation(player: LoLGameParticipant): number {
    return killParticipationFor(player, this.teamOf(player));
  }

  private csPerMinute(player: LoLGameParticipant): number {
    return (
      player.stats?.csPerMinute ??
      (this.minutes > 0
        ? creepScoreFor(player, this.timeline) / this.minutes
        : 0)
    );
  }

  private goldPerMinute(player: LoLGameParticipant): number {
    return (
      player.stats?.goldPerMinute ??
      (this.minutes > 0
        ? goldEarnedFor(player, this.timeline) / this.minutes
        : 0)
    );
  }

  private damagePerMinute(player: LoLGameParticipant): number {
    return (
      player.stats?.damagePerMinute ??
      (this.minutes > 0
        ? damageToChampionsFor(player, this.timeline) / this.minutes
        : 0)
    );
  }

  private damageTaken(player: LoLGameParticipant): number {
    return (
      player.stats?.damageTaken ??
      latestStatsFor(this.timeline, player.puuid)?.totalDamageTaken ??
      0
    );
  }

  private wardsPlaced(player: LoLGameParticipant): number {
    return player.stats?.wardsPlaced ?? 0;
  }

  /** Riot reports it in milliseconds on the timeline frames, seconds read better. */
  private crowdControl(player: LoLGameParticipant): number {
    return Math.round(
      (latestStatsFor(this.timeline, player.puuid)?.timeEnemySpentControlled ??
        0) / 1000,
    );
  }

  private pings(player: LoLGameParticipant): number {
    return player.allInPings + player.assistMePings + player.commandPings;
  }

  get ratingLabel(): string {
    return decimalLabel(this.rating, 1);
  }

  get ratingTone(): string {
    return ratingToneClass(this.rating);
  }

  get name(): string {
    return this.player ? playerFullName(this.player) : '';
  }

  get subtitle(): string {
    if (this.player == null) {
      return '';
    }

    return [
      this.player.championName ?? '',
      roleLabel(this.player.teamPosition),
      this.player.champLevel ? `Niveau ${this.player.champLevel}` : '',
      this.player.riotIdTagLine ? `#${this.player.riotIdTagLine}` : '',
    ]
      .filter((part) => part !== '')
      .join(' · ');
  }

  get championIconUrl(): string {
    return championIconUrl(this.player?.championName, this.patch);
  }

  get itemSlots(): number[] {
    return this.player ? itemSlots(this.player) : [];
  }

  get consumablesPurchased(): number {
    return this.player?.consumablesPurchased ?? 0;
  }

  itemIconUrl(itemId: number): string {
    return itemIconUrl(itemId, this.patch);
  }
}
