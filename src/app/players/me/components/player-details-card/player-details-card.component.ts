import { Component, Input, OnInit } from "@angular/core";
import { Player } from "src/app/shared/classes/Player";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { formatDate } from "@angular/common";
import { FifaPlayerStatsDto } from "src/app/shared/classes/FifaPlayerStatsDto";

@Component({
  selector: "app-player-details-card",
  templateUrl: "./player-details-card.component.html",
  styleUrls: ["./player-details-card.component.scss"],
})
export class PlayerDetailsCardComponent implements OnInit {
  @Input()
  player: Player = new Player();

  @Input()
  stats: FifaPlayerStatsDto = new FifaPlayerStatsDto();

  playerId: any;
  date = "";
  loading = true;
  calendarIcon = faCalendarAlt;

  ngOnInit(): void {
    this.date = formatDate(this.player.createdOn.toString(), "medium", "en-US");
    this.loading = false;
  }
}
