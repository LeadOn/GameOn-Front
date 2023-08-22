import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from "@angular/core";
import { Player } from "src/app/shared/classes/Player";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { formatDate } from "@angular/common";
import { PlatformStats } from "src/app/shared/classes/PlatformStats";

@Component({
  selector: "app-player-details-card",
  templateUrl: "./player-details-card.component.html",
  styleUrls: ["./player-details-card.component.scss"],
})
export class PlayerDetailsCardComponent implements OnInit, OnChanges {
  @Input()
  player: Player = new Player();

  @Input()
  stats: PlatformStats[] = [];

  date: string = "";

  totalStats = new PlatformStats();

  playerId: any;
  loading = true;

  calendarIcon = faCalendarAlt;

  constructor() {}

  ngOnInit(): void {
    this.date = formatDate(this.player.createdOn.toString(), "medium", "en-US");
    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["stats"] != null) {
      this.totalStats = new PlatformStats();
      let avgGoalsGiven: number[] = [];
      let avgGoalsTaken: number[] = [];

      this.stats.forEach((stat) => {
        this.totalStats.wins += stat.wins;
        this.totalStats.losses += stat.losses;
        this.totalStats.draws += stat.draws;
        this.totalStats.goalDifference += stat.goalDifference;
        avgGoalsGiven.push(stat.averageGoalGiven);
        avgGoalsTaken.push(stat.averageGoalTaken);
      });

      let totalGamePlayed =
        this.totalStats.wins + this.totalStats.losses + this.totalStats.draws;

      this.totalStats.winRate = parseFloat(
        ((this.totalStats.wins * 100) / totalGamePlayed).toFixed(2)
      );
      this.totalStats.looseRate = parseFloat(
        ((this.totalStats.losses * 100) / totalGamePlayed).toFixed(2)
      );
      this.totalStats.drawRate = parseFloat(
        ((this.totalStats.draws * 100) / totalGamePlayed).toFixed(2)
      );
      this.totalStats.averageGoalGiven = parseFloat(
        (
          avgGoalsGiven.reduce((a, b) => a + b, 0) / avgGoalsGiven.length
        ).toFixed(2)
      );
      this.totalStats.averageGoalTaken = parseFloat(
        (
          avgGoalsTaken.reduce((a, b) => a + b, 0) / avgGoalsTaken.length
        ).toFixed(2)
      );
    }
  }
}
