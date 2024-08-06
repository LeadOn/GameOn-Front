import { Component, Input } from "@angular/core";
import { FifaTeamDto } from "src/app/shared/classes/FifaTeamDto";

@Component({
  selector: "app-fifa-game-history-card-row",
  templateUrl: "./fifa-game-history-card-row.component.html",
  styleUrls: ["./fifa-game-history-card-row.component.scss"],
})
export class FifaGameHistoryCardRowComponent {
  @Input()
  team: FifaTeamDto = new FifaTeamDto();

  @Input()
  score1: number = 0;

  @Input()
  score2: number = 0;

  @Input()
  isPlayed = false;
}
