import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Player } from "src/app/classes/Player";
import { YuFootApiService } from "src/app/services/yufoot-api.service";

@Component({
  selector: "app-create-game",
  templateUrl: "./create-game.component.html",
  styleUrls: ["./create-game.component.scss"],
})
export class CreateGameComponent implements OnInit {
  isLoading = true;
  players: Player[] = [];

  createGameForm = new FormGroup({
    team1: new FormControl(),
  });

  constructor(private yuFootApi: YuFootApiService) {}

  ngOnInit(): void {
    this.yuFootApi.getPlayers().subscribe((data) => {
      this.players = data;
      this.isLoading = false;
      console.log(data);
    });
  }

  createGame() {
    alert("Cette fonctionnalité arrive prochainement !");
  }
}
