import { Component, OnInit } from "@angular/core";
import { Player } from "src/app/classes/Player";
import { YuFootApiService } from "src/app/services/yufoot-api.service";

@Component({
  selector: "app-home-players",
  templateUrl: "./home-players.component.html",
  styleUrls: ["./home-players.component.scss"],
})
export class HomePlayersComponent implements OnInit {
  players: Player[] = [];

  constructor(private yuFootApi: YuFootApiService) {}

  ngOnInit(): void {
    this.yuFootApi.getPlayers().subscribe((data) => {
      this.players = data;
    });
  }
}
