import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  faBorderAll,
  faChartSimple,
  faFilm,
  faTableList,
} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { LoLGame } from '../../../../shared/classes/lol/LoLGame';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import { LoLQueue } from '../../../../shared/classes/lol/LoLQueue';
import { GameOnLoLService } from '../../../../shared/services/leagueoflegends/gameon-lol.service';
import {
  bestParticipant,
  closestDdragonVersion,
  compositeScore,
  durationSecondsFor,
  formatCompact,
  teamGold,
  teamKillCount,
} from '../../../../shared/classes/lol/lol-match.util';
import { queueLabel } from '../../../../shared/classes/lol/lol-queue.util';
import { GameTab } from '../../components/lol-game-tabs/lol-game-tabs.component';

interface Scoreboard {
  teamId: number;
  label: string;
  dotClass: string;
  headerTintClass: string;
  outcomeLabel: string;
  outcomeTone: string;
  kills: number;
  goldLabel: string;
  players: LoLGameParticipant[];
}

@Component({
  selector: 'app-lol-game-details',
  templateUrl: './lol-game-details.component.html',
  styleUrl: './lol-game-details.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class LolGameDetailsComponent implements OnInit {
  gameId: any;
  playerId: any;

  game: LoLGame = new LoLGame();
  team1: LoLGameParticipant[] = [];
  team2: LoLGameParticipant[] = [];

  /**
   * Held as a field rather than a getter: it's bound as an @Input on half a
   * dozen children, and a fresh array on every change-detection pass would
   * re-run their (timeline-wide) ngOnChanges work each time.
   */
  allPlayers: LoLGameParticipant[] = [];

  /** Same reasoning as `allPlayers`: rebuilt on data change, not per CD pass. */
  scoreboards: Scoreboard[] = [];

  timeline?: LoLGameTimelineFrame[];
  selectedPlayer?: LoLGameParticipant;
  currentFrameIndex = 0;
  playProgress = 0;

  damageMode: 'dealt' | 'taken' = 'dealt';

  tabs: GameTab[] = [
    { id: 'overview', label: "Vue d'ensemble", icon: faBorderAll },
    { id: 'film', label: 'Film de la partie', icon: faFilm },
    { id: 'performance', label: 'Performance', icon: faChartSimple },
    { id: 'raw', label: 'Données brutes', icon: faTableList },
  ];
  activeTab = 'overview';

  gamePatch = '';
  lolQueues$: Observable<LoLQueue[]>;
  lolQueues: LoLQueue[] = [];
  lolVersions$: Observable<string[]>;
  lolVersions: string[] = [];

  isLoading = true;
  isSyncing = false;
  gameError = false;

  constructor(
    private route: ActivatedRoute,
    private lolService: GameOnLoLService,
    private lolStore: Store<{ lolQueues: LoLQueue[]; lolVersions: string[] }>,
  ) {
    this.lolQueues$ = this.lolStore.select('lolQueues');
    this.lolVersions$ = this.lolStore.select('lolVersions');
  }

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.playerId = this.route.snapshot.paramMap.get('playerId');

    this.lolQueues$.subscribe((queues) => {
      this.lolQueues = queues;
    });

    this.lolVersions$.subscribe((versions) => {
      this.lolVersions = versions;
      this.updateGamePatch();
    });

    this.loadGame();
  }

  loadGame() {
    this.isLoading = true;
    const previousPuuid = this.selectedPlayer?.puuid;

    this.lolService.getGame(this.gameId).subscribe(
      (game) => {
        this.game = game;

        this.updateGamePatch();

        const teams = game.leagueOfLegendsGameParticipants.reduce(
          (acc: { [teamId: number]: LoLGameParticipant[] }, player) => {
            if (!acc[player.teamId]) {
              acc[player.teamId] = [];
            }
            acc[player.teamId].push(player);
            return acc;
          },
          {},
        );

        this.team1 = teams[100] ?? [];
        this.team2 = teams[200] ?? [];
        this.allPlayers = [...this.team1, ...this.team2];
        this.buildScoreboards();

        this.selectedPlayer =
          this.allPlayers.find((p) => p.puuid == previousPuuid) ??
          this.heroPlayer ??
          this.team1[0] ??
          this.team2[0];

        this.getTimeline();
      },
      (err) => {
        this.gameError = true;
        this.isLoading = false;
        this.isSyncing = false;
        console.error(err);
      },
    );
  }

  updateGamePatch(): void {
    if (!this.game.gameVersion || this.lolVersions.length === 0) {
      return;
    }

    this.gamePatch = closestDdragonVersion(
      this.game.gameVersion,
      this.lolVersions,
    );
  }

  syncGame(): void {
    this.isSyncing = true;
    this.lolService.refreshGame(this.gameId).subscribe(
      () => {
        this.loadGame();
      },
      (err) => {
        this.isSyncing = false;
        this.gameError = true;
        console.error(err);
      },
    );
  }

  getTimeline() {
    this.lolService.getGameTimeline(this.gameId).subscribe(
      (timeline) => {
        this.timeline = [...timeline].sort((a, b) => a.timestamp - b.timestamp);
        this.currentFrameIndex = Math.max(0, this.timeline.length - 1);
        // Team gold only becomes available once the timeline is in.
        this.buildScoreboards();
        this.isLoading = false;
        this.isSyncing = false;
      },
      (err) => {
        this.gameError = true;
        this.isLoading = false;
        this.isSyncing = false;
        console.error(err);
      },
    );
  }

  buildScoreboards(): void {
    this.scoreboards = [
      {
        teamId: 100,
        label: 'Équipe bleue',
        dotClass: 'bg-mpGreen',
        // Same accent as the dot, washed across the header strip.
        headerTintClass:
          'bg-[linear-gradient(90deg,rgba(45,224,165,0.16),transparent_70%)]',
        players: this.team1,
      },
      {
        teamId: 200,
        label: 'Équipe rouge',
        dotClass: 'bg-mpRed',
        headerTintClass:
          'bg-[linear-gradient(90deg,rgba(255,92,116,0.16),transparent_70%)]',
        players: this.team2,
      },
    ]
      // Never-synced games carry no participants: an empty table with a column
      // header reads as broken, so the whole card is dropped instead.
      .filter((side) => side.players.length > 0)
      .map((side) => ({
        ...side,
        outcomeLabel: this.outcomeLabel(side.teamId),
        outcomeTone: this.outcomeTone(side.teamId),
        kills: teamKillCount(side.players),
        goldLabel: formatCompact(teamGold(side.players, this.timeline)),
      }));
  }

  private outcomeLabel(teamId: number): string {
    if (this.game.isRemake) return 'Remake';
    if (this.game.winningTeamId == null) return '';

    return this.game.winningTeamId === teamId ? 'Victoire' : 'Défaite';
  }

  private outcomeTone(teamId: number): string {
    if (this.game.isRemake || this.game.winningTeamId == null) {
      return 'text-mpTextSecondary';
    }

    return this.game.winningTeamId === teamId
      ? 'text-mpGreenInk'
      : 'text-mpRedInk';
  }

  onPlayerSelected(player: LoLGameParticipant) {
    this.selectedPlayer = player;
  }

  onPlayProgressChange(progress: number) {
    this.playProgress = progress;
  }

  setDamageMode(mode: 'dealt' | 'taken') {
    this.damageMode = mode;
  }

  setActiveTab(tabId: string) {
    this.activeTab = tabId;
  }

  get heroPlayer(): LoLGameParticipant | undefined {
    if (this.playerId == null) {
      return undefined;
    }

    return this.game.leagueOfLegendsGameParticipants.find(
      (p) => p.playerId == this.playerId,
    );
  }

  get queueLabel(): string {
    return queueLabel(this.lolQueues, this.game.queueId);
  }

  get durationSeconds(): number {
    return durationSecondsFor(this.game);
  }

  get winners(): LoLGameParticipant[] {
    if (this.game.winningTeamId === 100) return this.team1;
    if (this.game.winningTeamId === 200) return this.team2;
    return [];
  }

  get losers(): LoLGameParticipant[] {
    if (this.game.winningTeamId === 100) return this.team2;
    if (this.game.winningTeamId === 200) return this.team1;
    return [];
  }

  get mvpPuuid(): string | undefined {
    return bestParticipant(this.winners, (p) =>
      compositeScore(p, this.timeline),
    )?.player.puuid;
  }

  get acePuuid(): string | undefined {
    return bestParticipant(this.losers, (p) => compositeScore(p, this.timeline))
      ?.player.puuid;
  }
}
