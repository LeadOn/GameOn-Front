import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  ChangeDetectionStrategy,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faSync } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { LoLGame } from '../../../../shared/classes/lol/LoLGame';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import { GameOnLoLService } from '../../../../shared/services/leagueoflegends/gameon-lol.service';

interface ComparisonRow {
  player: LoLGameParticipant;
  value: number;
  widthPercent: number;
}

@Component({
  selector: 'app-lol-game-details',
  templateUrl: './lol-game-details.component.html',
  styleUrl: './lol-game-details.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LolGameDetailsComponent implements OnInit, AfterViewChecked {
  @ViewChild('playerHighlight')
  playerHighlight?: ElementRef<HTMLDivElement>;

  gameId: any;
  playerId: any;

  game: LoLGame = new LoLGame();
  team1: LoLGameParticipant[] = [];
  team2: LoLGameParticipant[] = [];

  timeline?: LoLGameTimelineFrame[];
  selectedPlayer?: LoLGameParticipant;
  selectedPlayerTimeline?: LoLGameTimelineFrame[];
  selectedComparisonFilter: 'all' | 'team1' | 'team2' = 'all';

  patchTitle = 'Patch inconnu';
  currentLoLPatch = '';
  lolVersion$: Observable<string>;

  refreshIcon = faSync;

  isLoading = true;
  gameError = false;
  private shouldFocusPlayerHighlight = false;

  constructor(
    private route: ActivatedRoute,
    private lolService: GameOnLoLService,
    private lolStore: Store<{ lolVersion: string }>,
  ) {
    this.lolVersion$ = this.lolStore.select('lolVersion');
  }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.playerId = this.route.snapshot.paramMap.get('playerId');

    this.lolVersion$.subscribe((version) => {
      this.currentLoLPatch = version;
    });

    this.loadGame();
  }

  ngAfterViewChecked(): void {
    if (this.shouldFocusPlayerHighlight == false) {
      return;
    }

    const highlight = this.playerHighlight?.nativeElement;
    if (highlight == null) {
      return;
    }

    highlight.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    highlight.focus({ preventScroll: true });
    this.shouldFocusPlayerHighlight = false;
  }

  loadGame() {
    this.isLoading = true;
    this.lolService.getGame(this.gameId).subscribe(
      (game) => {
        this.game = game;

        if (this.game.gameVersion) {
          const [major, minor] = this.game.gameVersion.split('.');
          this.patchTitle = `Patch ${major}.${minor}`;
        }

        let teams = game.leagueOfLegendsGameParticipants.reduce(
          (acc: { [teamId: number]: LoLGameParticipant[] }, player) => {
            if (!acc[player.teamId]) {
              acc[player.teamId] = [];
            }
            acc[player.teamId].push(player);
            return acc;
          },
          {},
        );

        let keys = Object.keys(teams);
        if (keys.length == 2) {
          keys.forEach((key) => {
            if (keys.indexOf(key) == 0) {
              this.team1 = teams[100];
            } else {
              this.team2 = teams[200];
            }
          });
        }

        this.getTimeline();
      },
      (err) => {
        this.gameError = true;
        console.error(err);
      },
    );
  }

  updateGame(): void {
    this.isLoading = true;
    this.lolService.refreshGame(this.gameId).subscribe(
      (x) => {
        this.loadGame();
      },
      (err) => {
        this.gameError = true;
        console.error(err);
      },
    );
  }

  getTimeline() {
    this.lolService.getGameTimeline(this.gameId).subscribe(
      (timeline) => {
        this.timeline = timeline;
        if (this.selectedPlayer != null) {
          this.selectedPlayerTimeline = this.buildPersonalTimeline(
            this.selectedPlayer,
          );
        }
        this.isLoading = false;
      },
      (err) => {
        this.gameError = true;
        console.error(err);
      },
    );
  }

  setComparisonFilter(filter: 'all' | 'team1' | 'team2') {
    this.selectedComparisonFilter = filter;
  }

  formatRetrievedOn(date?: Date | string): string {
    const parsedDate = date instanceof Date ? date : date ? new Date(date) : undefined;

    if (parsedDate == null || Number.isNaN(parsedDate.getTime())) {
      return 'Date inconnue';
    }

    const datePart = new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
    }).format(parsedDate);

    const timePart = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(parsedDate);

    return `${datePart} à ${timePart}`;
  }

  onPlayerSelected(player: LoLGameParticipant) {
    this.selectedPlayer = player;
    this.selectedPlayerTimeline = this.buildPersonalTimeline(player);
    this.shouldFocusPlayerHighlight = true;
  }

  private buildPersonalTimeline(
    player: LoLGameParticipant,
  ): LoLGameTimelineFrame[] | undefined {
    if (this.timeline == null) {
      return undefined;
    }

    const personalTimeline: LoLGameTimelineFrame[] = [];

    this.timeline.forEach((frame) => {
      const personalFrame = new LoLGameTimelineFrame();
      personalFrame.timestamp = frame.timestamp;
      personalFrame.matchId = frame.matchId;
      personalFrame.id = frame.id;
      personalFrame.loLGameTimelineFrameParticipants = [];

      frame.loLGameTimelineFrameParticipants.forEach((participant) => {
        if (participant.participantPUUID == player.puuid) {
          personalFrame.loLGameTimelineFrameParticipants.push(participant);
        }
      });

      personalTimeline.push(personalFrame);
    });

    return personalTimeline;
  }

  // --- Hero header ---

  get heroPlayer(): LoLGameParticipant | undefined {
    if (this.playerId == null) {
      return undefined;
    }

    return this.game.leagueOfLegendsGameParticipants.find(
      (p) => p.playerId == this.playerId,
    );
  }

  get heroWon(): boolean | undefined {
    return this.heroPlayer?.win;
  }

  get heroKda(): string {
    const player = this.heroPlayer;
    if (player == null) {
      return '0,00';
    }

    const denominator = player.deaths === 0 ? 1 : player.deaths;
    return this.formatKda((player.kills + player.assists) / denominator);
  }

  get heroStatusLabel(): string {
    if (this.game.endOfGameResult == null || this.game.endOfGameResult === '') {
      return 'Partie non synchronisée';
    }

    return this.heroWon ? 'Victoire' : 'Défaite';
  }

  get heroStatusClass(): string {
    if (this.game.endOfGameResult == null || this.game.endOfGameResult === '') {
      return 'text-gray-500 dark:text-gray-300';
    }

    return this.heroWon ? 'text-customGreen' : 'text-frenchRed';
  }

  get heroCardClass(): string {
    if (this.game.endOfGameResult == null || this.game.endOfGameResult === '') {
      return 'border-bgLightDarker dark:border-bgDarkDarker bg-bgLight/80 dark:bg-bgDark/80';
    }

    return this.heroWon
      ? 'border-customGreen/40 bg-customGreen/10'
      : 'border-frenchRed/40 bg-frenchRed/10';
  }

  get queueLabel(): string {
    if (this.game.queueType == 'RANKED_SOLO_DUO') {
      return 'Classée Solo/Duo';
    }

    if (this.game.queueType == 'RANKED_FLEX') {
      return 'Classée Flex';
    }

    if (
      this.game.queueType == '5v5 Draft Pick games' ||
      this.game.queueType == 'NORMAL_5V5'
    ) {
      return 'Normale';
    }

    return this.game.queueType;
  }

  get gameDurationLabel(): string {
    const gameStart = new Date(this.game.gameStart);
    const gameEnd = new Date(this.game.gameEnd);
    const duration = (gameEnd.getTime() - gameStart.getTime()) / 1000;

    if (Number.isNaN(duration) || duration <= 0) {
      return '00:00';
    }

    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  championIconUrl(player?: LoLGameParticipant): string {
    if (player?.championName) {
      return `https://ddragon.leagueoflegends.com/cdn/${this.currentLoLPatch}/img/champion/${player.championName}.png`;
    }

    return 'assets/img/gameon-logo.webp';
  }

  // --- Focus player panel ---

  private latestFrameStats(puuid?: string) {
    const latestFrame = this.timeline
      ?.slice()
      .sort((a, b) => a.timestamp - b.timestamp)
      .at(-1);

    return latestFrame?.loLGameTimelineFrameParticipants?.find(
      (p) => p.participantPUUID == puuid,
    );
  }

  get selectedPlayerGoldLabel(): string {
    if (this.selectedPlayer == null) {
      return '0';
    }

    const stats = this.latestFrameStats(this.selectedPlayer.puuid);
    return this.formatCompact(stats?.totalGold || 0);
  }

  // --- Comparisons ---

  get comparisonPlayers(): LoLGameParticipant[] {
    if (this.selectedComparisonFilter == 'team1') {
      return this.team1;
    }

    if (this.selectedComparisonFilter == 'team2') {
      return this.team2;
    }

    return [...this.team1, ...this.team2];
  }

  get damageComparisonRows(): ComparisonRow[] {
    return this.buildComparisonRows(
      (player) =>
        this.latestFrameStats(player.puuid)?.totalDamageDoneToChampions || 0,
    );
  }

  get goldComparisonRows(): ComparisonRow[] {
    return this.buildComparisonRows(
      (player) => this.latestFrameStats(player.puuid)?.totalGold || 0,
    );
  }

  get kdaComparisonRows(): ComparisonRow[] {
    return this.buildComparisonRows((player) => {
      const denominator = player.deaths === 0 ? 1 : player.deaths;
      return (player.kills + player.assists) / denominator;
    });
  }

  private buildComparisonRows(
    valueFn: (player: LoLGameParticipant) => number,
  ): ComparisonRow[] {
    const rows = this.comparisonPlayers.map((player) => ({
      player,
      value: valueFn(player),
    }));

    rows.sort((a, b) => b.value - a.value);

    const max = rows.reduce((m, row) => Math.max(m, row.value), 0) || 1;

    return rows.map((row) => ({
      ...row,
      widthPercent: Math.max(4, (row.value / max) * 100),
    }));
  }

  teamBarClass(player: LoLGameParticipant): string {
    return player.teamId == 100 ? 'bg-customGreen' : 'bg-frenchRed';
  }

  formatCompact(value: number): string {
    if (value >= 1000) {
      return (value / 1000).toFixed(1) + 'k';
    }

    return value.toFixed(0);
  }

  formatKda(value: number): string {
    return value.toFixed(2).replace('.', ',');
  }
}
