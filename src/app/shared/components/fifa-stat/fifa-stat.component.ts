import { Component, Input, OnInit } from "@angular/core";
import { PlatformStats } from "../../classes/PlatformStats";

@Component({
  selector: "app-fifa-stat",
  templateUrl: "./fifa-stat.component.html",
  styleUrls: ["./fifa-stat.component.scss"],
})
export class FifaStatComponent implements OnInit {
  @Input()
  stat: PlatformStats = new PlatformStats();

  ngOnInit(): void {
    let gamesPlayed = this.stat.wins + this.stat.losses + this.stat.draws;
    this.stat.winRate = parseFloat(
      ((this.stat.wins * 100) / gamesPlayed).toFixed(2)
    );
    this.stat.looseRate = parseFloat(
      ((this.stat.losses * 100) / gamesPlayed).toFixed(2)
    );
    this.stat.drawRate = parseFloat(
      ((this.stat.draws * 100) / gamesPlayed).toFixed(2)
    );
  }
}
