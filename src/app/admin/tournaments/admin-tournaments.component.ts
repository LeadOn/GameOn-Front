import { Component, OnInit } from "@angular/core";
import { Player } from "src/app/shared/classes/Player";
import { Tournament } from "src/app/shared/classes/Tournament";
import { YuGamesPlayerService } from "src/app/shared/services/yugames-player.service";
import { YuGamesTournamentService } from "src/app/shared/services/yugames-tournament.service";

@Component({
  selector: "app-admin-tournaments",
  templateUrl: "./admin-tournaments.component.html",
  styleUrls: ["./admin-tournaments.component.scss"],
})
export class AdminTournamentsComponent implements OnInit {
  tournaments: Tournament[] = [];
  states: any[] = [];
  loading = true;

  constructor(private tournamentService: YuGamesTournamentService) {
    this.states = this.tournamentService.getStates();
  }

  ngOnInit(): void {
    this.tournamentService.getAll().subscribe(
      (data) => {
        this.tournaments = data;
        this.loading = false;
      },
      (err) => {
        alert("Une erreur est survenue lors de la récupération des tournois.");
        console.error(err);
        this.loading = false;
      }
    );
  }

  getState(stateId: number): string {
    let label = "Inconnu";
    this.states.forEach((x) => {
      if (x.value == stateId) {
        label = x.label;
      }
    });

    return label;
  }
}
