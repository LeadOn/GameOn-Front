import { Component, Input } from "@angular/core";
import { GamePlayed } from "src/app/classes/GamePlayed";
import { Team } from "src/app/classes/Team";

@Component({
  selector: "app-game-played-card-row",
  templateUrl: "./game-played-card-row.component.html",
  styleUrls: ["./game-played-card-row.component.scss"],
})
export class GamePlayedCardRowComponent {
  @Input()
  team: Team = new Team();

  @Input()
  score1: number = 0;

  @Input()
  score2: number = 0;
}
