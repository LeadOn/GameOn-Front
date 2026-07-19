import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { LoLGame } from '../../../../shared/classes/lol/LoLGame';
import { LoLQueue } from '../../../../shared/classes/lol/LoLQueue';
import { queueLabel } from '../../../../shared/classes/lol/lol-queue.util';
import { closestDdragonVersion } from '../../../../shared/classes/lol/lol-match.util';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-lol-game-card',
  standalone: false,

  templateUrl: './lol-game-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lol-game-card.component.css',
})
export class LolGameCardComponent implements OnInit, OnChanges {
  @Input()
  game: LoLGame = new LoLGame();

  @Input()
  playerId?: number;

  @Output()
  gameRefreshed = new EventEmitter<void>();

  @Output()
  gameRefreshStarted = new EventEmitter<void>();

  lolQueues$: Observable<LoLQueue[]>;
  lolQueues: LoLQueue[] = [];
  lolVersions$: Observable<string[]>;
  lolVersions: string[] = [];

  won?: boolean;
  gameDuration?: string;
  kda = '0.00';
  kills = 0;
  deaths = 0;
  assists = 0;
  championName?: string;
  champLevel?: number;

  item0 = 0;
  item1 = 0;
  item2 = 0;
  item3 = 0;
  item4 = 0;
  item5 = 0;
  item6 = 0;
  itemSlots: number[] = [0, 0, 0, 0, 0, 0];

  isRefreshing = false;

  constructor(
    private lolStore: Store<{ lolQueues: LoLQueue[]; lolVersions: string[] }>,
  ) {
    this.lolQueues$ = this.lolStore.select('lolQueues');
    this.lolVersions$ = this.lolStore.select('lolVersions');
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateValues();

    if (changes['game'] && this.isRefreshing) {
      this.isRefreshing = false;
    }
  }

  ngOnInit(): void {
    this.lolQueues$.subscribe((queues) => {
      this.lolQueues = queues;
    });

    this.lolVersions$.subscribe((versions) => {
      this.lolVersions = versions;
    });
  }

  calculateValues() {
    if (this.game.gameId != 0) {
      if (this.game.leagueOfLegendsGameParticipants.length > 0) {
        // Getting current user if ID is given
        if (this.playerId) {
          let player = this.game.leagueOfLegendsGameParticipants.find(
            (x) => x.playerId == this.playerId,
          );

          if (player != null) {
            // setting champ image
            this.championName = player.championName;
            this.champLevel = player.champLevel;
            this.kills = player.kills;
            this.deaths = player.deaths;
            this.assists = player.assists;

            this.item0 = player.item0;
            this.item1 = player.item1;
            this.item2 = player.item2;
            this.item3 = player.item3;
            this.item4 = player.item4;
            this.item5 = player.item5;
            this.item6 = player.item6;
            this.itemSlots = [
              this.item0,
              this.item1,
              this.item2,
              this.item3,
              this.item4,
              this.item5,
            ];

            const kdaDenominator = this.deaths === 0 ? 1 : this.deaths;
            this.kda = ((this.kills + this.assists) / kdaDenominator).toFixed(
              2,
            );

            if (player.win != null) {
              this.won = player.win;
            }
          }
        }
      }

      // Calculating game duration
      let gameStart = new Date(this.game.gameStart);
      let gameEnd = new Date(this.game.gameEnd);

      let duration = (gameEnd.getTime() - gameStart.getTime()) / 1000;

      let minutes = Math.floor(duration / 60);
      let seconds = Math.floor(duration % 60);
      this.gameDuration =
        minutes.toString().padStart(2, '0') +
        ':' +
        seconds.toString().padStart(2, '0');
    }
  }

  get statusLabel(): string {
    if (this.game.isRemake) {
      return 'Remake';
    }

    if (this.game.endOfGameResult == null) {
      return 'Inconnu';
    }

    return this.won ? 'Victoire' : 'Défaite';
  }

  get statusClass(): string {
    if (this.game.isRemake) {
      return 'text-slate-400';
    }

    if (this.game.endOfGameResult == null) {
      return 'text-slate-600';
    }

    return this.won ? 'text-customGreen' : 'text-frenchRed';
  }

  get queueLabel(): string {
    return queueLabel(this.lolQueues, this.game.queueId);
  }

  get gamePatch(): string {
    if (!this.game.gameVersion || this.lolVersions.length === 0) {
      return '';
    }

    return closestDdragonVersion(this.game.gameVersion, this.lolVersions);
  }
}
