import { Component, OnInit } from "@angular/core";
import { Player } from "src/app/classes/Player";
import { YuFootPlayerService } from "src/app/services/yufoot-player.service";

@Component({
  selector: "app-home-players",
  templateUrl: "./home-players.component.html",
  styleUrls: ["./home-players.component.scss"],
})
export class HomePlayersComponent implements OnInit {
  players: Player[] = [];

  constructor(private playerService: YuFootPlayerService) {}

  ngOnInit(): void {
    this.playerService.getAll().subscribe((data) => {
      this.players = data;
    });
  }
}
