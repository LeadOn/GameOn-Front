import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  championIconUrl,
  latestStatsFor,
} from '../../../../shared/classes/lol/lol-match.util';

interface DamageRow {
  player: LoLGameParticipant;
  physical: number;
  magic: number;
  trueDamage: number;
  taken: number;
  total: number;
}

@Component({
  selector: 'app-lol-game-damage-chart',
  standalone: false,
  templateUrl: './lol-game-damage-chart.component.html',
  styleUrl: './lol-game-damage-chart.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameDamageChartComponent {
  @Input()
  players: LoLGameParticipant[] = [];

  @Input()
  timeline?: LoLGameTimelineFrame[];

  @Input()
  patch = '';

  @Input()
  mode: 'dealt' | 'taken' = 'dealt';

  @Input()
  selectedPuuid?: string;

  @Output()
  playerSelected = new EventEmitter<LoLGameParticipant>();

  get rows(): DamageRow[] {
    const rows = this.players.map((player) => {
      const stats = latestStatsFor(this.timeline, player.puuid);
      return {
        player,
        physical: stats?.physicalDamageDoneToChampions ?? 0,
        magic: stats?.magicDamageDoneToChampions ?? 0,
        trueDamage: stats?.trueDamageDoneToChampions ?? 0,
        taken: stats?.totalDamageTaken ?? 0,
        total: stats?.totalDamageDoneToChampions ?? 0,
      };
    });

    const key =
      this.mode == 'dealt'
        ? (r: DamageRow) => r.total
        : (r: DamageRow) => r.taken;
    return rows.sort((a, b) => key(b) - key(a));
  }

  get maxValue(): number {
    const key =
      this.mode == 'dealt'
        ? (r: DamageRow) => r.total
        : (r: DamageRow) => r.taken;
    return this.rows.reduce((m, r) => Math.max(m, key(r)), 0) || 1;
  }

  widthPercent(value: number): number {
    return Math.max(2, (value / this.maxValue) * 100);
  }

  segmentPercent(value: number, total: number): number {
    return total <= 0 ? 0 : (value / total) * 100;
  }

  championIconUrl(player: LoLGameParticipant): string {
    return championIconUrl(player.championName, this.patch);
  }

  select(player: LoLGameParticipant): void {
    this.playerSelected.emit(player);
  }
}
