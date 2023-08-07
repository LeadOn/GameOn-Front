import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  faCalendarAlt,
  faArrowAltCircleLeft,
} from "@fortawesome/free-regular-svg-icons";
import { PlatformStats } from "src/app/classes/PlatformStats";
import { YuFootPlayerService } from "src/app/services/yufoot-player.service";

@Component({
  selector: "app-player-details",
  templateUrl: "./player-details.component.html",
  styleUrls: ["./player-details.component.scss"],
})
export class PlayerDetailsComponent implements OnInit {
  playerId: any;
  loading = true;
  player: any = null;
  calendarIcon = faCalendarAlt;
  backIcon = faArrowAltCircleLeft;
  stats: PlatformStats[] = [];

  constructor(
    private route: ActivatedRoute,
    private playerService: YuFootPlayerService
  ) {}

  ngOnInit(): void {
    this.loading = true;
    this.playerId = this.route.snapshot.paramMap.get("id");
    this.getPlayer(this.playerId);
  }

  getPlayer(id: number) {
    this.playerService.get(id).subscribe((data) => {
      // Getting stats
      this.playerService.getStats(id).subscribe(
        (data) => {
          this.stats = data;

          this.stats.forEach((stat) => {
            let gamesPlayed = stat.wins + stat.losses + stat.draws;
            stat.winRate = parseFloat(
              ((stat.wins * 100) / gamesPlayed).toFixed(2)
            );
            stat.looseRate = parseFloat(
              ((stat.losses * 100) / gamesPlayed).toFixed(2)
            );
            stat.drawRate = parseFloat(
              ((stat.draws * 100) / gamesPlayed).toFixed(2)
            );
          });
        },
        (err) => {
          alert(
            "Une erreur est survenue lors de la récupération des statistiques."
          );
          console.log(err);
        }
      );

      this.player = data;
      this.loading = false;
    });
  }
}
