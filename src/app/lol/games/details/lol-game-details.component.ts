import { Component, OnInit } from '@angular/core';
import { GameOnLoLService } from '../../../shared/services/leagueoflegends/gameon-lol.service';
import { LoLGame } from '../../../shared/classes/LoLGame';
import { ActivatedRoute } from '@angular/router';
import {
  faCalendar,
  faExternalLink,
  faSync,
} from '@fortawesome/free-solid-svg-icons';
import { LoLGameParticipant } from '../../../shared/classes/LoLGameParticipant';

@Component({
    selector: 'app-lol-game-details',
    templateUrl: './lol-game-details.component.html',
    styleUrl: './lol-game-details.component.scss',
    standalone: false
})
export class LolGameDetailsComponent implements OnInit {
  gameId: any;

  game: LoLGame = new LoLGame();
  team1: LoLGameParticipant[] = [];
  team2: LoLGameParticipant[] = [];

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

        let teams = game.leagueOfLegendsGameParticipants.reduce(
          (acc: { [teamId: number]: LoLGameParticipant[] }, player) => {
            if (!acc[player.teamId]) {
              acc[player.teamId] = [];
            }
            acc[player.teamId].push(player);
            return acc;
          },
          {}
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

        this.isLoading = false;
        console.log(this.game);
        console.log(this.team1);
        console.log(this.team2);
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
