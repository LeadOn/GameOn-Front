import { Component, OnInit } from "@angular/core";
import { GamePlayed } from "src/app/shared/classes/GamePlayed";
import { YuFootGameService } from "src/app/shared/services/yufoot-game.service";
import { YuGamesAdminService } from "../shared/services/yugames-admin.service";

@Component({
  selector: "app-admin-fifa-games",
  templateUrl: "./admin-fifa-games.component.html",
  styleUrls: ["./admin-fifa-games.component.scss"],
})
export class AdminFifaGamesComponent implements OnInit {
  games: GamePlayed[] = [];
  loading = true;

  constructor(
    private gameService: YuFootGameService,
    private adminService: YuGamesAdminService
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
        alert("Une erreur est survenue lors de la récupération des matchs.");
        console.error(err);
        this.loading = false;
      }
    );
  }

  deleteGame(game: GamePlayed) {
    if (
      confirm(
        "Voulez-vous vraiment supprimer le match " +
          game.id +
          "? ATTENTION : cette action est irréversible !"
      ) &&
      this.loading == false
    ) {
      this.loading = true;
      this.adminService.deleteGame(game.id).subscribe(
        (data) => {
          alert("Suppression réussie !");
          this.getGames();
        },
        (err) => {
          this.loading = false;
          console.error(err);
          alert("Erreur lors de la suppression du match.");
        }
      );
    }
  }
}
