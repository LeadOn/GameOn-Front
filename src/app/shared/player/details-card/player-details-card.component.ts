import { Component, Input, OnInit } from "@angular/core";
import { Player } from "src/app/classes/Player";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { formatDate } from "@angular/common";

@Component({
  selector: "app-player-details-card",
  templateUrl: "./player-details-card.component.html",
  styleUrls: ["./player-details-card.component.scss"],
})
export class PlayerDetailsCardComponent implements OnInit {
  @Input()
  player: Player = new Player();

  playerId: any;
  loading = true;
  winRate = 0;
  looseRate = 0;
  drawRate = 0;
  averageGoals = 0;
  calendarIcon = faCalendarAlt;
  date: string = "";

  constructor() {}

  ngOnInit(): void {
    this.date = formatDate(this.player.createdOn.toString(), "medium", "en-US");
    this.loading = false;
    this.winRate = parseFloat(
      ((this.player.wins * 100) / this.player.matchPlayed).toFixed(2)
    );
    this.looseRate = parseFloat(
      ((this.player.losses * 100) / this.player.matchPlayed).toFixed(2)
    );
    this.drawRate = parseFloat(
      ((this.player.draws * 100) / this.player.matchPlayed).toFixed(2)
    );
    this.averageGoals = parseFloat(
      (this.player.totalGoals / this.player.matchPlayed).toFixed(2)
    );
  }
}
