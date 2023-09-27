import { Component, OnInit } from "@angular/core";
import { YuGamesTournamentService } from "../shared/services/yugames-tournament.service";
import { Tournament } from "../shared/classes/Tournament";
import { trigger, style, animate, transition } from "@angular/animations";
import { GlobalStatsDto } from "../shared/classes/GlobalStatsDto";
import { YuGamesPlayerService } from "../shared/services/yugames-player.service";

@Component({
  selector: "app-stats-home",
  templateUrl: "./stats-home.component.html",
  styleUrls: ["./stats-home.component.scss"],
  animations: [
    trigger("inOutAnimation", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 })),
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate(200, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class StatsHomeComponent implements OnInit {
  loading = true;
  stats?: GlobalStatsDto;

  constructor(private playerService: YuGamesPlayerService) {}

  ngOnInit(): void {
    this.playerService.getGlobalStats().subscribe(
      (data) => {
        this.stats = data;
        this.loading = false;
      },
      (err) => {
        alert("Erreur lors de la récupération des statistiques.");
        console.error(err);
      }
    );
  }
}
