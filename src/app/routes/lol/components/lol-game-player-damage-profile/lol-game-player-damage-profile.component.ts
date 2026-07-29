import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
} from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  damageSplitFor,
  damageToChampionsFor,
  formatCompact,
  latestStatsFor,
} from '../../../../shared/classes/lol/lol-match.util';

interface DamageRow {
  label: string;
  dotClass: string;
  barClass: string;
  valueLabel: string;
  percent: number;
}

@Component({
  selector: 'app-lol-game-player-damage-profile',
  standalone: false,
  templateUrl: './lol-game-player-damage-profile.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGamePlayerDamageProfileComponent implements OnChanges {
  @Input()
  player?: LoLGameParticipant;

  @Input()
  players: LoLGameParticipant[] = [];

  @Input()
  timeline?: LoLGameTimelineFrame[];

  rows: DamageRow[] = [];
  /** False on never-synced games: the timeline carries no per-type damage. */
  hasSplitData = false;
  teamDamageShare = 0;
  damageTakenLabel = '0';
  teamDamageTakenShare = 0;

  ngOnChanges(): void {
    if (this.player == null) {
      this.rows = [];
      this.hasSplitData = false;
      return;
    }

    const split = damageSplitFor(this.player, this.timeline);
    const physical = split?.physical ?? 0;
    const magic = split?.magic ?? 0;
    const trueDamage = split?.trueDamage ?? 0;
    const total = physical + magic + trueDamage;

    this.hasSplitData = split != null;

    this.rows = [
      {
        label: 'Physiques',
        dotClass: 'bg-mpYellow',
        barClass: 'bg-mpYellow',
        valueLabel: this.shareLabel(physical, total),
        percent: this.percent(physical, total),
      },
      {
        label: 'Magiques',
        dotClass: 'bg-mpBlue',
        barClass: 'bg-mpBlue',
        valueLabel: this.shareLabel(magic, total),
        percent: this.percent(magic, total),
      },
      {
        label: 'Bruts',
        dotClass: 'bg-white light:bg-[rgba(23,30,54,0.55)]',
        barClass: 'bg-white light:bg-[rgba(23,30,54,0.55)]',
        valueLabel: this.shareLabel(trueDamage, total),
        percent: this.percent(trueDamage, total),
      },
    ];

    const team = this.players.filter((p) => p.teamId === this.player?.teamId);

    this.teamDamageShare = this.percent(
      damageToChampionsFor(this.player, this.timeline),
      team.reduce((sum, p) => sum + damageToChampionsFor(p, this.timeline), 0),
    );

    const damageTaken = this.damageTaken(this.player);
    this.damageTakenLabel = formatCompact(damageTaken);
    this.teamDamageTakenShare = this.percent(
      damageTaken,
      team.reduce((sum, p) => sum + this.damageTaken(p), 0),
    );
  }

  private damageTaken(player: LoLGameParticipant): number {
    return (
      player.stats?.damageTaken ??
      latestStatsFor(this.timeline, player.puuid)?.totalDamageTaken ??
      0
    );
  }

  private percent(value: number, total: number): number {
    return total > 0 ? Math.round((value / total) * 100) : 0;
  }

  private shareLabel(value: number, total: number): string {
    return `${formatCompact(value)} · ${this.percent(value, total)}%`;
  }
}
