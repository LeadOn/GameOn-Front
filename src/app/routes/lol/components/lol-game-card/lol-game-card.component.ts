import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { faRefresh } from '@fortawesome/free-solid-svg-icons';
import { LoLGame } from '../../../../shared/classes/lol/LoLGame';
import { environment } from '../../../../../environments/environment';
import { GameOnLoLService } from '../../../../shared/services/leagueoflegends/gameon-lol.service';

@Component({
  selector: 'app-lol-game-card',
  standalone: false,

  templateUrl: './lol-game-card.component.html',
  styleUrl: './lol-game-card.component.css',
})
export class LolGameCardComponent implements OnChanges {
  @Input()
  game: LoLGame = new LoLGame();

  @Input()
  playerId?: number;

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

  refreshIcon = faRefresh;

  currentLoLPatch: string = environment.currentLoLPatch;

  constructor(private lolService: GameOnLoLService) {}

  ngOnChanges(changes: SimpleChanges): void {
    this.calculateValues();
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

            this.kda = ((this.kills + this.assists) / this.deaths).toFixed(2);

            this.item0 = player.item0;
            this.item1 = player.item1;
            this.item2 = player.item2;
            this.item3 = player.item3;
            this.item4 = player.item4;
            this.item5 = player.item5;
            this.item6 = player.item6;

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

  updateGame(): void {
    let matchId = this.game.matchId;

    this.lolService.refreshGame(matchId).subscribe(
      (x) => {
        alert('Merci de rafraichir la page pour voir les changements.');
      },
      (err) => {
        console.error(err);
      },
    );
  }
}
