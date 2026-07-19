import {
  Component,
  inject,
  OnInit,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  faSync,
  faCrown,
  faRankingStar,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import Keycloak from 'keycloak-js';
import { PlayerDto } from '../../shared/classes/common/PlayerDto';
import { Player } from '../../shared/classes/common/Player';
import { GameOnLoLService } from '../../shared/services/leagueoflegends/gameon-lol.service';
import { LeagueOfLegendsRankHistory } from '../../shared/classes/lol/LeagueOfLegendsRankHistory';
import {
  tierRankScore,
  tierWinRate,
  tierLabel,
} from '../../shared/classes/lol/lol-tier.util';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-lol-home',
  templateUrl: './lol-home.component.html',
  styleUrl: './lol-home.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LolHomeComponent implements OnInit {
  private readonly keycloak = inject(Keycloak);

  leaguePlayers: PlayerDto[] = [];
  isLoading = true;
  isLoggedIn = false;
  player$: Observable<Player>;
  currentLoLPatch = '';
  apiUrl = environment.gameOnApiUrl;

  isRefreshing = false;
  refreshIcon = faSync;
  crownIcon = faCrown;
  rankingIcon = faRankingStar;
  funStatsIcon = faTrophy;

  view: 'ranking' | 'funstats' = 'ranking';

  tierLabel = tierLabel;

  sortColumn: 'name' | 'solo' | 'flex' | 'winrate' = 'solo';
  sortDirection: 'asc' | 'desc' = 'asc';

  constructor(
    private lolService: GameOnLoLService,
    private store: Store<{ player: Player; lolVersion: string }>,
  ) {
    this.player$ = store.select('player');
    store.select('lolVersion').subscribe((v) => (this.currentLoLPatch = v));

    this.isLoggedIn =
      this.keycloak.authenticated != null && this.keycloak.authenticated
        ? true
        : false;
  }

  login() {
    this.keycloak.login();
  }

  ngOnInit() {
    this.lolService.getAll().subscribe(
      (players) => {
        this.leaguePlayers = players;
        this.isLoading = false;
      },
      (err) => {
        console.error(err);
      },
    );
  }

  refreshAll() {
    this.isRefreshing = true;
    this.lolService.refreshAllRanks().subscribe({
      next: () => {
        this.lolService.getAll().subscribe((players) => {
          this.leaguePlayers = players;
          this.isRefreshing = false;
        });
      },
      error: (err) => {
        console.error(err);
        this.isRefreshing = false;
      },
    });
  }

  setSort(col: 'name' | 'solo' | 'flex' | 'winrate') {
    if (this.sortColumn === col) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = col;
      this.sortDirection = 'asc';
    }
  }

  get sortLabel(): string {
    switch (this.sortColumn) {
      case 'name':
        return 'nom';
      case 'solo':
        return 'rang Solo Queue';
      case 'flex':
        return 'rang Flex';
      case 'winrate':
        return 'winrate';
    }
  }

  get sortedPlayers(): PlayerDto[] {
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    return [...this.leaguePlayers].sort((a, b) => {
      if (this.sortColumn === 'name') {
        return dir * (a.fullName ?? '').localeCompare(b.fullName ?? '');
      }
      if (this.sortColumn === 'winrate') {
        return dir * (this.getWinRateScore(a) - this.getWinRateScore(b));
      }
      const rankA =
        this.sortColumn === 'solo'
          ? a.leagueOfLegendsSoloRank
          : a.leagueOfLegendsFlexRank;
      const rankB =
        this.sortColumn === 'solo'
          ? b.leagueOfLegendsSoloRank
          : b.leagueOfLegendsFlexRank;
      return dir * (tierRankScore(rankA) - tierRankScore(rankB));
    });
  }

  get topThreePlayers(): PlayerDto[] {
    return [...this.leaguePlayers]
      .filter((p) => p.leagueOfLegendsSoloRank != null)
      .sort(
        (a, b) =>
          tierRankScore(a.leagueOfLegendsSoloRank) -
          tierRankScore(b.leagueOfLegendsSoloRank),
      )
      .slice(0, 3);
  }

  private getWinRateScore(player: PlayerDto): number {
    const winRate = this.getPlayerWinRate(player);
    return winRate == null ? Number.MAX_SAFE_INTEGER : -winRate;
  }

  getPlayerWinRate(player: PlayerDto): number | null {
    if (player.leagueOfLegendsSoloRank != null) {
      return this.getWinRate(player.leagueOfLegendsSoloRank);
    }
    if (player.leagueOfLegendsFlexRank != null) {
      return this.getWinRate(player.leagueOfLegendsFlexRank);
    }
    return null;
  }

  getWinRate(rank: LeagueOfLegendsRankHistory): number {
    return tierWinRate(rank);
  }

  winRateClass(value: number): string {
    if (value > 50) return 'text-customGreen';
    if (value === 50) return 'text-customYellow';
    return 'text-customRed';
  }

  podiumCardClass(i: number): string {
    return i === 0
      ? 'border-customYellow/60 bg-customYellow/5'
      : 'border-bgLightDarker dark:border-bgDarkDarker bg-bgLight/80 dark:bg-bgDark/80';
  }

  podiumRankBadgeClass(i: number): string {
    return i === 0
      ? 'bg-customYellow/20 text-customYellow'
      : 'bg-bgLightDarker dark:bg-bgDarkDarker text-gray-500 dark:text-gray-300';
  }

  podiumAccentClass(i: number): string {
    return i === 0 ? 'text-customYellow' : 'text-customGreen';
  }

  podiumBarClass(i: number): string {
    return i === 0 ? 'bg-customYellow' : 'bg-customGreen';
  }
}
