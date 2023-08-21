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

  totalGamePlayed: number = 0;
  totalWins: number = 0;
  totalLosses: number = 0;
  totalDraws: number = 0;
  totalWinRate: number = 0;
  totalLooseRate: number = 0;
  totalDrawRate: number = 0;
  totalAverageGoalsGiven: number = 0;
  totalAverageGoalsTaken: number = 0;
  totalGoalDifference: number = 0;

  playerId: any;
  loading = true;

  calendarIcon = faCalendarAlt;

  constructor() {}

  ngOnInit(): void {
    this.date = formatDate(this.player.createdOn.toString(), "medium", "en-US");
    this.loading = false;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes["stats"] != null && this.totalGamePlayed == 0) {
      let avgGoalsGiven: number[] = [];
      let avgGoalsTaken: number[] = [];

      this.stats.forEach((stat) => {
        this.totalGamePlayed += stat.wins + stat.losses + stat.draws;
        this.totalWins += stat.wins;
        this.totalLosses += stat.losses;
        this.totalDraws += stat.draws;
        this.totalGoalDifference += stat.goalDifference;
        avgGoalsGiven.push(stat.averageGoalGiven);
        avgGoalsTaken.push(stat.averageGoalTaken);
      });

      this.totalWinRate = parseFloat(
        ((this.totalWins * 100) / this.totalGamePlayed).toFixed(2)
      );
      this.totalLooseRate = parseFloat(
        ((this.totalLosses * 100) / this.totalGamePlayed).toFixed(2)
      );
      this.totalDrawRate = parseFloat(
        ((this.totalDraws * 100) / this.totalGamePlayed).toFixed(2)
      );
      this.totalAverageGoalsGiven = parseFloat(
        (
          avgGoalsGiven.reduce((a, b) => a + b, 0) / avgGoalsGiven.length
        ).toFixed(2)
      );
      this.totalAverageGoalsTaken = parseFloat(
        (
          avgGoalsTaken.reduce((a, b) => a + b, 0) / avgGoalsTaken.length
        ).toFixed(2)
      );
    }
  }
}
