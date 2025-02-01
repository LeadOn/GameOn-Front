import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { faCalendar, faSync } from '@fortawesome/free-solid-svg-icons';
import { LoLGame } from '../../../../shared/classes/lol/LoLGame';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import { GameOnLoLService } from '../../../../shared/services/leagueoflegends/gameon-lol.service';

@Component({
  selector: 'app-lol-game-details',
  templateUrl: './lol-game-details.component.html',
  styleUrl: './lol-game-details.component.scss',
  standalone: false,
})
export class LolGameDetailsComponent implements OnInit {
  gameId: any;
  playerId: any;

  game: LoLGame = new LoLGame();
  team1: LoLGameParticipant[] = [];
  team2: LoLGameParticipant[] = [];

  timeline?: LoLGameTimelineFrame[];

  patchTitle = 'Patch inconnu';

  refreshIcon = faSync;
  calendarIcon = faCalendar;

  isLoading = true;
  gameError = false;

  constructor(
    private route: ActivatedRoute,
    private lolService: GameOnLoLService,
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');
    this.playerId = this.route.snapshot.paramMap.get('playerId');

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
        this.isLoading = false;
      },
      (err) => {
        this.gameError = true;
        console.error(err);
      },
    );
  }
}
