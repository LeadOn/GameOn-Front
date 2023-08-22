import { Component, OnInit } from "@angular/core";
import { FifaGamePlayed } from "src/app/shared/classes/FifaGamePlayed";
import { YuGamesGameService } from "src/app/shared/services/yugames-game.service";

@Component({
  selector: "app-admin-fifa-games",
  templateUrl: "./admin-fifa-games.component.html",
  styleUrls: ["./admin-fifa-games.component.scss"],
})
export class AdminFifaGamesComponent implements OnInit {
  games: FifaGamePlayed[] = [];
  loading = true;
  isAdmin = true;

  constructor(private gameService: YuGamesGameService) {}

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
        alert("Une erreur est survenue lors de la récupération des matchs.");
        console.error(err);
        this.loading = false;
      }
    );
  }
}
