import { Component, OnInit } from '@angular/core';
import { GameOnLoLService } from '../../../shared/services/leagueoflegends/gameon-lol.service';
import { LoLGame } from '../../../shared/classes/LoLGame';
import { ActivatedRoute } from '@angular/router';
import {
  faCalendar,
  faExternalLink,
  faSync,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-lol-game-details',
  templateUrl: './lol-game-details.component.html',
  styleUrl: './lol-game-details.component.scss',
})
export class LolGameDetailsComponent implements OnInit {
  gameId: any;

  game: LoLGame = new LoLGame();

  patchTitle = 'Patch inconnu';

  refreshIcon = faSync;
  calendarIcon = faCalendar;
  externalIcon = faExternalLink;

  isLoading = true;
  gameError = false;

  constructor(
    private route: ActivatedRoute,
    private lolService: GameOnLoLService
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');

    this.loadGame();
  }

  loadGame() {
    this.isLoading = true;
    this.lolService.getGame(this.gameId).subscribe(
      (game) => {
        this.game = game;

        if (this.game.gameVersion) {
          this.patchTitle = `Patch ${this.game.gameVersion}`;
        }

        this.isLoading = false;
        console.log(this.game);
      },
      (err) => {
        this.gameError = true;
        console.error(err);
      }
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
      }
    );
  }
}
