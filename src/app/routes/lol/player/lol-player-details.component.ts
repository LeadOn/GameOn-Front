import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  ElementRef,
  HostListener,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faExternalLink, faSync } from '@fortawesome/free-solid-svg-icons';
import { PlayerDto } from '../../../shared/classes/common/PlayerDto';
import {
  LeagueOfLegendsRankHistory,
  LoLRankHistoryGranularity,
} from '../../../shared/classes/lol/LeagueOfLegendsRankHistory';
import { LoLGame } from '../../../shared/classes/lol/LoLGame';
import { LoLQueue } from '../../../shared/classes/lol/LoLQueue';
import { environment } from '../../../../environments/environment';
import { GameOnLoLService } from '../../../shared/services/leagueoflegends/gameon-lol.service';
import {
  tierRankScore,
  tierGlowShadow,
  tierGlowBackground,
  tierEmblemUrl,
  tierLabel,
} from '../../../shared/classes/lol/lol-tier.util';
import { formatRelativeDate } from '../../../shared/classes/lol/lol-match.util';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

type RankHistoryRange = 'sevenDays' | 'day' | 'week' | 'month';

@Component({
  selector: 'app-lol-player-details',
  templateUrl: './lol-player-details.component.html',
  styleUrl: './lol-player-details.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LolPlayerDetailsComponent implements OnInit {
  private readonly autoRankSyncThresholdMs = 60 * 60 * 1000;
  private hasAutoRankSynced = false;

  lolVersion$: Observable<string>;

  playerId: any;
  loading = true;
  gameHistoryLoading = true;
  rankHistoryLoading = false;
  // Always fetched with a granularity: the backend carries the last known
  // rank forward for periods without a change, so Solo/Flex are always
  // continuous series and never show a gap against each other.
  rankHistoryRange: RankHistoryRange = 'day';
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
  pageSize = 10;
  totalItems = 0;
  totalPages = 1;
  hasNextPage = false;
  rankedOnly = true;
  queueOptions: LoLQueue[] = [];
  selectedQueueIds: number[] = [];
  queueFilterOpen = false;

  rankPosition: number | null = null;

  tierEmblemUrl = tierEmblemUrl;
  tierLabel = tierLabel;

  constructor(
    private route: ActivatedRoute,
    private lolService: GameOnLoLService,
    private lolStore: Store<{ lolVersion: string }>,
    private elementRef: ElementRef,
  ) {
    this.lolVersion$ = this.lolStore.select('lolVersion');
  }

  ngOnInit(): void {
    this.playerId = this.route.snapshot.paramMap.get('id');
    this.getSummoner();
    this.loadQueueOptions();

    this.lolVersion$.subscribe((version) => {
      this.currentLoLPatch = version;
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent) {
    if (
      this.queueFilterOpen &&
      !this.elementRef.nativeElement.contains(event.target)
    ) {
      this.queueFilterOpen = false;
    }
  }

  loadQueueOptions() {
    this.lolService.getQueuesForPlayer(this.playerId).subscribe(
      (queues) => {
        this.queueOptions = queues;
      },
      (err) => {
        console.error(err);
      },
    );
  }

  queueLabel(queue: LoLQueue): string {
    return queue.description || `${queue.map} #${queue.id}`;
  }

  isQueueSelected(id: number): boolean {
    return this.selectedQueueIds.includes(id);
  }

  get queueFilterLabel(): string {
    if (this.selectedQueueIds.length === 0) {
      return 'Toutes les files';
    }

    if (this.selectedQueueIds.length === 1) {
      const queue = this.queueOptions.find(
        (q) => q.id === this.selectedQueueIds[0],
      );
      return queue != null ? this.queueLabel(queue) : '1 file sélectionnée';
    }

    return `${this.selectedQueueIds.length} files sélectionnées`;
  }

  toggleQueueFilter() {
    this.queueFilterOpen = !this.queueFilterOpen;
  }

  toggleQueue(id: number, event: Event) {
    const checked = (event.target as HTMLInputElement).checked;

    this.selectedQueueIds = checked
      ? [...this.selectedQueueIds, id]
      : this.selectedQueueIds.filter((queueId) => queueId !== id);

    this.currentPage = 1;
    this.getLastGamesPlayed();
  }

  clearQueueFilter() {
    if (this.selectedQueueIds.length === 0) {
      this.queueFilterOpen = false;
      return;
    }

    this.selectedQueueIds = [];
    this.queueFilterOpen = false;
    this.currentPage = 1;
    this.getLastGamesPlayed();
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
        this.loadRankPosition();
      },
      (err) => {
        console.error(err);
      },
    );
  }

  loadRankPosition() {
    if (this.player?.leagueOfLegendsSoloRank == null) {
      this.rankPosition = null;
      return;
    }

    this.lolService.getAll().subscribe(
      (players) => {
        const ranked = players
          .filter((p) => p.leagueOfLegendsSoloRank != null)
          .sort(
            (a, b) =>
              tierRankScore(a.leagueOfLegendsSoloRank) -
              tierRankScore(b.leagueOfLegendsSoloRank),
          );
        const index = ranked.findIndex((p) => p.id === this.player!.id);
        this.rankPosition = index >= 0 ? index + 1 : null;
      },
      (err) => {
        console.error(err);
      },
    );
  }

  get rankPositionLabel(): string | null {
    if (this.rankPosition == null) {
      return null;
    }

    return this.rankPosition === 1
      ? '1er du classement'
      : `${this.rankPosition}e du classement`;
  }

  get syncedAgoLabel(): string {
    if (this.player?.lolRefreshedOn == null) {
      return 'Jamais synchronisé';
    }

    return 'Synchro ' + formatRelativeDate(this.player.lolRefreshedOn);
  }

  getTierGlowShadow(rank?: LeagueOfLegendsRankHistory): string {
    return tierGlowShadow(rank);
  }

  getTierGlowBackground(rank?: LeagueOfLegendsRankHistory): string {
    return tierGlowBackground(rank);
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

  onRankHistoryRangeChange(event: Event) {
    const range = (event.target as HTMLSelectElement).value as RankHistoryRange;

    if (this.rankHistoryRange === range) {
      return;
    }

    this.rankHistoryRange = range;
    this.getRankHistory();
  }

  get rankHistoryGranularity(): LoLRankHistoryGranularity {
    switch (this.rankHistoryRange) {
      case 'sevenDays':
      case 'day':
        return 'Day';
      case 'week':
        return 'Week';
      case 'month':
        return 'Month';
    }
  }

  // 'sevenDays' reuses the 'Day' granularity with an explicit 7-day window
  // instead of its 21-day default, so it doesn't need its own backend enum.
  private get rankHistoryDays(): number | undefined {
    return this.rankHistoryRange === 'sevenDays' ? 7 : undefined;
  }

  getRankHistory() {
    this.rankHistoryLoading = true;

    this.lolService
      .getRankHistory(
        this.playerId,
        this.rankHistoryGranularity,
        this.rankHistoryDays,
      )
      .subscribe(
        (data) => {
          this.rankHistory = data;
          this.calculateWinRate();
          this.loading = false;
          this.rankHistoryLoading = false;
        },
        (err) => {
          console.error(err);
          this.loading = false;
          this.rankHistoryLoading = false;
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
        this.selectedQueueIds,
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
