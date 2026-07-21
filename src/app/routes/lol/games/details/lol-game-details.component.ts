import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faSync } from '@fortawesome/free-solid-svg-icons';
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
  formatDuration,
  gameDurationSeconds,
  kda,
} from '../../../../shared/classes/lol/lol-match.util';
import { queueLabel } from '../../../../shared/classes/lol/lol-queue.util';

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

  timeline?: LoLGameTimelineFrame[];
  selectedPlayer?: LoLGameParticipant;
  currentFrameIndex = 0;
  playProgress = 0;

  damageMode: 'dealt' | 'taken' = 'dealt';

  patchTitle = 'Patch inconnu';
  gamePatch = '';
  lolQueues$: Observable<LoLQueue[]>;
  lolQueues: LoLQueue[] = [];
  lolVersions$: Observable<string[]>;
  lolVersions: string[] = [];

  refreshIcon = faSync;

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

        if (this.game.gameVersion) {
          const [major, minor] = this.game.gameVersion.split('.');
          this.patchTitle = `Patch ${major}.${minor}`;
        }

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

  onPlayerSelected(player: LoLGameParticipant) {
    this.selectedPlayer = player;
  }

  onPlayProgressChange(progress: number) {
    this.playProgress = progress;
  }

  setDamageMode(mode: 'dealt' | 'taken') {
    this.damageMode = mode;
  }

  formatRetrievedOn(date?: Date | string): string {
    const parsedDate =
      date instanceof Date ? date : date ? new Date(date) : undefined;

    if (parsedDate == null || Number.isNaN(parsedDate.getTime())) {
      return 'Date inconnue';
    }

    const datePart = new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'long',
    }).format(parsedDate);

    const timePart = new Intl.DateTimeFormat('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(parsedDate);

    return `${datePart} à ${timePart}`;
  }

  get heroPlayer(): LoLGameParticipant | undefined {
    if (this.playerId == null) {
      return undefined;
    }

    return this.game.leagueOfLegendsGameParticipants.find(
      (p) => p.playerId == this.playerId,
    );
  }

  get heroWon(): boolean | undefined {
    if (this.game.isRemake) {
      return undefined;
    }

    return this.heroPlayer?.win;
  }

  get heroKda(): string {
    return this.heroPlayer
      ? kda(this.heroPlayer).toFixed(2).replace('.', ',')
      : '0,00';
  }

  get heroStatusLabel(): string {
    if (this.game.isRemake) {
      return 'Remake';
    }

    if (this.game.endOfGameResult == null || this.game.endOfGameResult === '') {
      return 'Partie non synchronisée';
    }

    return this.heroWon ? 'Victoire' : 'Défaite';
  }

  get queueLabel(): string {
    return queueLabel(this.lolQueues, this.game.queueId);
  }

  get durationSeconds(): number {
    return gameDurationSeconds(this.game);
  }

  get gameDurationLabel(): string {
    return formatDuration(this.durationSeconds);
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

  get team1BaronKills(): number {
    return this.team1.reduce((sum, p) => sum + p.baronKills, 0);
  }

  get team2BaronKills(): number {
    return this.team2.reduce((sum, p) => sum + p.baronKills, 0);
  }

  get allPlayers(): LoLGameParticipant[] {
    return [...this.team1, ...this.team2];
  }

  championIconUrl(player?: LoLGameParticipant): string {
    if (player?.championName) {
      return `https://ddragon.leagueoflegends.com/cdn/${this.gamePatch}/img/champion/${player.championName}.png`;
    }

    return 'assets/img/gameon-logo.webp';
  }
}
