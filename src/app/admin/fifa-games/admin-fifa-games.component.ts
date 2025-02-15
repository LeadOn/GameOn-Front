import { Component, OnInit } from '@angular/core';
import { GameOnAdminService } from '../shared/services/gameon-admin.service';
import { FifaGamePlayed } from '../../shared/classes/fifa/FifaGamePlayed';
import { GameOnGameService } from '../../shared/services/fifa/gameon-game.service';

@Component({
  selector: 'app-admin-fifa-games',
  templateUrl: './admin-fifa-games.component.html',
  styleUrls: ['./admin-fifa-games.component.css'],
  standalone: false,
})
export class AdminFifaGamesComponent implements OnInit {
  games: FifaGamePlayed[] = [];
  loading = true;
  isAdmin = true;

  constructor(
    private gameService: GameOnGameService,
    private adminService: GameOnAdminService,
  ) {}

  ngOnInit(): void {
    this.getGames();
  }

  getGames() {
    this.loading = true;
    this.gameService.getLast(50).subscribe(
      (data) => {
        this.games = data;
        this.loading = false;
      },
      (err) => {
        alert('Une erreur est survenue lors de la récupération des matchs.');
        console.error(err);
        this.loading = false;
      },
    );
  }
}
