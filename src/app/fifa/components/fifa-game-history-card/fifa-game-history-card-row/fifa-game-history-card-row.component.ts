import { Component, Input } from "@angular/core";
import { Team } from "src/app/shared/classes/Team";

@Component({
  selector: "app-fifa-game-history-card-row",
  templateUrl: "./fifa-game-history-card-row.component.html",
  styleUrls: ["./fifa-game-history-card-row.component.scss"],
})
export class FifaGameHistoryCardRowComponent {
  @Input()
  team: Team = new Team();

  @Input()
  score1: number = 0;

  @Input()
  score2: number = 0;
}
