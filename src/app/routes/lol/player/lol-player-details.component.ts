import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faExternalLink, faSync } from '@fortawesome/free-solid-svg-icons';
import { PlayerDto } from '../../../shared/classes/common/PlayerDto';
import { LeagueOfLegendsRankHistory } from '../../../shared/classes/lol/LeagueOfLegendsRankHistory';
import { LoLGame } from '../../../shared/classes/lol/LoLGame';
import { environment } from '../../../../environments/environment';
import { GameOnLoLService } from '../../../shared/services/leagueoflegends/gameon-lol.service';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-lol-player-details',
  templateUrl: './lol-player-details.component.html',
  styleUrl: './lol-player-details.component.css',
  standalone: false,
})
export class LolPlayerDetailsComponent implements OnInit {
  private readonly autoRankSyncThresholdMs = 60 * 60 * 1000;
  private hasAutoRankSynced = false;

  lolVersion$: Observable<string>;

  playerId: any;
  loading = true;
  gameHistoryLoading = true;
  player?: PlayerDto;
  refreshIcon = faSync;
  rankHistory: LeagueOfLegendsRankHistory[] = [];
  soloWins = 0;
  soloLosses = 0;
  flexWins = 0;
  flexLosses = 0;
  soloWinRate = 0.0;
  flexWinRate = 0.0;
  overAllWinRate = 0.0;
  gamesPlayed: LoLGame[] = [];
  currentLoLPatch: string = '';
  syncIcon = faSync;
  externalIcon = faExternalLink;
  apiUrl = environment.gameOnApiUrl;

  currentPage = 1;
  pageSize = 5;
  totalItems = 0;
  totalPages = 1;
  hasNextPage = false;
  rankedOnly = true;

  constructor(
    private route: ActivatedRoute,
    private lolService: GameOnLoLService,
    private lolStore: Store<{ lolVersion: string }>,
  ) {
    this.lolVersion$ = this.lolStore.select('lolVersion');
  }

  ngOnInit(): void {
    this.playerId = this.route.snapshot.paramMap.get('id');
    this.getSummoner();

    this.lolVersion$.subscribe((version) => {
      this.currentLoLPatch = version;
    });
  }

  getSummoner() {
    this.lolService.getById(this.playerId).subscribe(
      (player) => {
        this.player = player;

        if (this.shouldAutoSyncRank(player)) {
          this.hasAutoRankSynced = true;
          this.refreshSummoner();
          return;
        }

        this.getRankHistory();
        this.getLastGamesPlayed();
      },
      (err) => {
        console.error(err);
      },
    );
  }

  shouldAutoSyncRank(player: PlayerDto): boolean {
    if (this.hasAutoRankSynced || player.lolRefreshedOn == null) {
      return false;
    }

    const lastRefreshDate = new Date(player.lolRefreshedOn);
    if (Number.isNaN(lastRefreshDate.getTime())) {
      return false;
    }

    return (
      Date.now() - lastRefreshDate.getTime() > this.autoRankSyncThresholdMs
    );
  }

  calculateWinRate() {
    if (this.rankHistory.length > 0) {
      let lastSoloRanked = this.rankHistory
        .filter((history) => history.queueType === 'RANKED_SOLO_5x5')
        .pop();

      if (lastSoloRanked != null) {
        this.soloWins = lastSoloRanked.wins;
        this.soloLosses = lastSoloRanked.losses;
        this.soloWinRate =
          (this.soloWins / (this.soloWins + this.soloLosses)) * 100;
      }

      let lastFlexRanked = this.rankHistory
        .filter((history) => history.queueType === 'RANKED_FLEX_SR')
        .pop();

      if (lastFlexRanked != null) {
        this.flexWins = lastFlexRanked.wins;
        this.flexLosses = lastFlexRanked.losses;
        this.flexWinRate =
          (this.flexWins / (this.flexWins + this.flexLosses)) * 100;
      }

      let totalWins = this.soloWins + this.flexWins;
      let totalLosses = this.soloLosses + this.flexLosses;
      this.overAllWinRate = (totalWins / (totalWins + totalLosses)) * 100;
    }
  }

  getRankHistory() {
    this.lolService.getRankHistory(this.playerId, 25).subscribe(
      (data) => {
        this.rankHistory = data;
        this.calculateWinRate();
        this.loading = false;
      },
      (err) => {
        console.error(err);
      },
    );
  }

  getLastGamesPlayed() {
    const requestedPage = this.currentPage;
    this.gameHistoryLoading = true;
    this.lolService
      .getLastGamesPlayedByPlayer(
        this.playerId,
        requestedPage,
        this.pageSize,
        this.rankedOnly,
      )
      .subscribe(
        (data) => {
          const resultsPerPage = data.resultsPerPage || this.pageSize || 1;

          this.gamesPlayed = data.results;
          this.pageSize = resultsPerPage;
          this.totalItems = data.total;
          this.totalPages = Math.max(
            1,
            Math.ceil(this.totalItems / resultsPerPage),
          );

          const normalizedPage = Math.min(
            Math.max(1, requestedPage),
            this.totalPages,
          );

          if (normalizedPage !== requestedPage) {
            this.currentPage = normalizedPage;
            this.getLastGamesPlayed();
            return;
          }

          this.currentPage = normalizedPage;
          this.hasNextPage = this.currentPage < this.totalPages;
          this.gameHistoryLoading = false;
        },
        (err) => {
          console.error(err);
          this.gameHistoryLoading = false;
        },
      );
  }

  onPageSizeChange(event: Event) {
    this.pageSize = Number((event.target as HTMLSelectElement).value);
    this.currentPage = 1;
    this.getLastGamesPlayed();
  }

  onRankedOnlyChange(event: Event) {
    this.rankedOnly = (event.target as HTMLInputElement).checked;
    this.currentPage = 1;
    this.getLastGamesPlayed();
  }

  prevPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.getLastGamesPlayed();
    }
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.getLastGamesPlayed();
    }
  }

  goToPage(page: number) {
    if (page < 1 || page > this.totalPages || page === this.currentPage) {
      return;
    }

    this.currentPage = page;
    this.getLastGamesPlayed();
  }

  get compactPageItems(): {
    label: string;
    page: number | null;
    isCurrent: boolean;
    isEllipsis: boolean;
  }[] {
    const pagesToShow = new Set<number>([1, this.totalPages]);
    const siblingCount = 2;

    for (
      let page = this.currentPage - siblingCount;
      page <= this.currentPage + siblingCount;
      page++
    ) {
      if (page >= 1 && page <= this.totalPages) {
        pagesToShow.add(page);
      }
    }

    const orderedPages = Array.from(pagesToShow).sort((a, b) => a - b);
    const items: {
      label: string;
      page: number | null;
      isCurrent: boolean;
      isEllipsis: boolean;
    }[] = [];

    let previousPage: number | null = null;

    for (const page of orderedPages) {
      if (previousPage != null && page - previousPage > 1) {
        items.push({
          label: '…',
          page: null,
          isCurrent: false,
          isEllipsis: true,
        });
      }

      items.push({
        label: String(page),
        page,
        isCurrent: page === this.currentPage,
        isEllipsis: false,
      });

      previousPage = page;
    }

    return items;
  }

  refreshSummoner() {
    this.loading = true;
    this.gameHistoryLoading = true;
    this.lolService.refreshById(this.playerId).subscribe(
      () => {
        this.getSummoner();
      },
      (err) => {
        console.error(err);
      },
    );
  }

  refreshGame(matchId: string) {
    this.gameHistoryLoading = true;
    this.lolService.refreshGame(matchId).subscribe(
      (data) => {
        this.getLastGamesPlayed();
      },
      (err) => {
        console.error(err);
      },
    );
  }

  onGameRefreshStarted() {
    // La card gère son propre état isRefreshing
  }
}
