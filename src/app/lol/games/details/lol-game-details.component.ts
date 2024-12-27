import { Component, OnInit } from '@angular/core';
import { GameOnLoLService } from '../../../shared/services/leagueoflegends/gameon-lol.service';
import { LoLGame } from '../../../shared/classes/LoLGame';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-lol-game-details',
  templateUrl: './lol-game-details.component.html',
  styleUrl: './lol-game-details.component.scss',
})
export class LolGameDetailsComponent implements OnInit {
  gameId: any;
  game: LoLGame = new LoLGame();
  isLoading = true;

  constructor(
    private route: ActivatedRoute,
    private lolService: GameOnLoLService
  ) {}

  ngOnInit(): void {
    this.gameId = this.route.snapshot.paramMap.get('id');

    this.lolService.getGame(this.gameId).subscribe(
      (game) => {
        this.game = game;
        this.isLoading = false;
        console.log(this.game);
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
