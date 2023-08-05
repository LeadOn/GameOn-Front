import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { faCalendarAlt } from "@fortawesome/free-regular-svg-icons";
import { YuFootApiService } from "src/app/services/yufoot-api.service";

@Component({
  selector: "app-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.scss"],
})
export class PlayerDetailsComponent implements OnInit {
  playerId: any;
  loading = true;
  player: any = null;
  winRate = 0;
  looseRate = 0;
  drawRate = 0;
  averageGoals = 0;
  calendarIcon = faCalendarAlt;
  date: string = "";

  constructor(
    private route: ActivatedRoute,
    private yuFootApi: YuFootApiService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.playerId = this.route.snapshot.paramMap.get("id");
    this.getPlayer(this.playerId);
  }

  getPlayer(id: number) {
    this.yuFootApi.getPlayer(id).subscribe((data) => {
      this.date = formatDate(data.createdOn.toString(), "medium", "en-US");
      this.player = data;
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
    });
  }
}
