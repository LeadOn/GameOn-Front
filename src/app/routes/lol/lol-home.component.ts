import { Component, inject, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import Keycloak from 'keycloak-js';
import { PlayerDto } from '../../shared/classes/common/PlayerDto';
import { Player } from '../../shared/classes/common/Player';
import { GameOnLoLService } from '../../shared/services/leagueoflegends/gameon-lol.service';
import { LeagueOfLegendsRankHistory } from '../../shared/classes/lol/LeagueOfLegendsRankHistory';
import { environment } from '../../../environments/environment';

const TIER_ORDER = [
  'CHALLENGER',
  'GRANDMASTER',
  'MASTER',
  'DIAMOND',
  'EMERALD',
  'PLATINUM',
  'GOLD',
  'SILVER',
  'BRONZE',
  'IRON',
];
const RANK_ORDER = ['I', 'II', 'III', 'IV'];

@Component({
  selector: 'app-lol-home',
  templateUrl: './lol-home.component.html',
  styleUrl: './lol-home.component.css',
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

  sortColumn: 'name' | 'solo' | 'flex' = 'solo';
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

  setSort(col: 'name' | 'solo' | 'flex') {
    if (this.sortColumn === col) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = col;
      this.sortDirection = 'asc';
    }
  }

  get sortedPlayers(): PlayerDto[] {
    const dir = this.sortDirection === 'asc' ? 1 : -1;
    return [...this.leaguePlayers].sort((a, b) => {
      if (this.sortColumn === 'name') {
        return dir * (a.fullName ?? '').localeCompare(b.fullName ?? '');
      }
      const rankA =
        this.sortColumn === 'solo'
          ? a.leagueOfLegendsSoloRank
          : a.leagueOfLegendsFlexRank;
      const rankB =
        this.sortColumn === 'solo'
          ? b.leagueOfLegendsSoloRank
          : b.leagueOfLegendsFlexRank;
      return dir * (this.getRankScore(rankA) - this.getRankScore(rankB));
    });
  }

  private getRankScore(rank?: LeagueOfLegendsRankHistory): number {
    if (!rank) return Number.MAX_SAFE_INTEGER;
    const tierScore = TIER_ORDER.indexOf(rank.tier.toUpperCase());
    const divScore = RANK_ORDER.indexOf(rank.rank.toUpperCase());
    const t = tierScore < 0 ? 99 : tierScore;
    const d = divScore < 0 ? 0 : divScore;
    return t * 10000 + d * 1000 - rank.leaguePoints;
  }

  get sortedBySolo(): PlayerDto[] {
    return [...this.leaguePlayers].sort(
      (a, b) =>
        this.getRankScore(a.leagueOfLegendsSoloRank) -
        this.getRankScore(b.leagueOfLegendsSoloRank),
    );
  }

  get sortedByFlex(): PlayerDto[] {
    return [...this.leaguePlayers].sort(
      (a, b) =>
        this.getRankScore(a.leagueOfLegendsFlexRank) -
        this.getRankScore(b.leagueOfLegendsFlexRank),
    );
  }

  getWinRate(rank: LeagueOfLegendsRankHistory): number {
    const total = rank.wins + rank.losses;
    return total === 0 ? 0 : Math.round((rank.wins / total) * 100);
  }
}
