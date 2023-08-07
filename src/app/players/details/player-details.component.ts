import { formatDate } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import {
  faCalendarAlt,
  faArrowAltCircleLeft,
} from "@fortawesome/free-regular-svg-icons";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { GamePlayed } from "src/app/classes/GamePlayed";
import { PlatformStats } from "src/app/classes/PlatformStats";
import { YuFootGameService } from "src/app/services/yufoot-game.service";
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
  externalIcon = faExternalLinkAlt;
  games: GamePlayed[] = [];

  constructor(
    private route: ActivatedRoute,
    private playerService: YuFootPlayerService,
    private gameService: YuFootGameService
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
        (data2) => {
          this.stats = data2;

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

          // Getting last games played
          this.gameService.getLastByPlayer(id, 20).subscribe(
            (data3) => {
              this.games = data3;
              this.player = data;
              this.loading = false;
            },
            (err) => {
              alert(
                "Erreur lors de la récupération des dernières parties jouées."
              );
              console.error(err);
            }
          );
        },
        (err) => {
          alert(
            "Une erreur est survenue lors de la récupération des statistiques."
          );
          console.error(err);
        }
      );
    });
  }
}
