import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameParticipantStats } from '../../../../shared/classes/lol/LoLGameParticipantStats';
import {
  championIconUrl,
  decimalLabel,
  formatFull,
} from '../../../../shared/classes/lol/lol-match.util';

interface RankingStat {
  key: string;
  label: string;
  valueFn: (stats: LoLGameParticipantStats) => number;
  formatFn: (value: number) => string;
  description?: string;
}

interface RankingRow {
  player: LoLGameParticipant;
  value: number;
}

const STATS: RankingStat[] = [
  {
    key: 'kda',
    label: 'KDA',
    valueFn: (s) => s.kda,
    formatFn: (v) => decimalLabel(v, 2),
  },
  {
    key: 'csPerMinute',
    label: 'CS/min',
    valueFn: (s) => s.csPerMinute,
    formatFn: (v) => decimalLabel(v),
  },
  {
    key: 'goldPerMinute',
    label: 'Or/min',
    valueFn: (s) => s.goldPerMinute,
    formatFn: (v) => formatFull(v),
  },
  {
    key: 'damagePerMinute',
    label: 'Dégâts/min',
    valueFn: (s) => s.damagePerMinute,
    formatFn: (v) => formatFull(v),
  },
  {
    key: 'damageTaken',
    label: 'Dégâts subis',
    valueFn: (s) => s.damageTaken,
    formatFn: (v) => formatFull(v),
  },
  {
    key: 'killParticipationPercent',
    label: 'Participation',
    valueFn: (s) => s.killParticipationPercent,
    formatFn: (v) => `${Math.round(v)}%`,
    description:
      "Part des éliminations de l'équipe auxquelles le joueur a contribué : (kills + assists du joueur) ÷ (kills totaux de l'équipe) × 100",
  },
  {
    key: 'wardsPlaced',
    label: 'Wards posées',
    valueFn: (s) => s.wardsPlaced,
    formatFn: (v) => formatFull(v),
  },
];

@Component({
  selector: 'app-lol-game-ranking-chart',
  standalone: false,
  templateUrl: './lol-game-ranking-chart.component.html',
  styleUrl: './lol-game-ranking-chart.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameRankingChartComponent {
  @Input()
  players: LoLGameParticipant[] = [];

  @Input()
  selectedPuuid?: string;

  @Input()
  patch = '';

  @Output()
  playerSelected = new EventEmitter<LoLGameParticipant>();

  stats = STATS;
  selectedStatKey = STATS[0].key;

  get selectedStat(): RankingStat {
    return (
      this.stats.find((s) => s.key === this.selectedStatKey) ?? this.stats[0]
    );
  }

  get playersWithStats(): LoLGameParticipant[] {
    return this.players.filter((p) => p.stats != null);
  }

  get excludedPlayerCount(): number {
    return this.players.length - this.playersWithStats.length;
  }

  get rows(): RankingRow[] {
    const stat = this.selectedStat;
    return this.playersWithStats
      .map((player) => ({ player, value: stat.valueFn(player.stats!) }))
      .sort((a, b) => b.value - a.value);
  }

  get maxValue(): number {
    return this.rows.reduce((m, row) => Math.max(m, row.value), 0) || 1;
  }

  widthPercent(value: number): number {
    return Math.max(2, (value / this.maxValue) * 100);
  }

  formatValue(value: number): string {
    return this.selectedStat.formatFn(value);
  }

  selectStat(key: string): void {
    this.selectedStatKey = key;
  }

  select(player: LoLGameParticipant): void {
    this.playerSelected.emit(player);
  }

  championIconUrl(player: LoLGameParticipant): string {
    return championIconUrl(player.championName, this.patch);
  }
}
