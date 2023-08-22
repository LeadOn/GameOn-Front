import { Component, OnInit } from "@angular/core";
import { Player } from "src/app/shared/classes/Player";
import { YuGamesPlayerService } from "src/app/shared/services/yugames-player.service";

@Component({
  selector: "app-admin-players",
  templateUrl: "./admin-players.component.html",
  styleUrls: ["./admin-players.component.scss"],
})
export class AdminPlayersComponent implements OnInit {
  players: Player[] = [];
  loading = true;

  constructor(private playerService: YuGamesPlayerService) {}

  ngOnInit(): void {
    this.playerService.getAll().subscribe(
      (data) => {
        this.players = data;
        this.loading = false;
      },
      (err) => {
        alert("Une erreur est survenue lors de la récupération des players.");
        console.error(err);
        this.loading = false;
      }
    );
  }
}
