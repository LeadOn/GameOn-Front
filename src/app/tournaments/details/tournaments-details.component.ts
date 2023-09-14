import { Component, OnInit } from "@angular/core";
import { Tournament } from "src/app/shared/classes/Tournament";
import { YuGamesTournamentService } from "src/app/shared/services/yugames-tournament.service";
import { trigger, style, animate, transition } from "@angular/animations";
import { ActivatedRoute } from "@angular/router";

@Component({
  selector: "app-tournaments-details",
  templateUrl: "./tournaments-details.component.html",
  styleUrls: ["./tournaments-details.component.scss"],
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
export class TournamentsDetailsComponent implements OnInit {
  loading = true;
  states: any[] = [];
  tournament?: Tournament;
  tournamentId: any;

  constructor(
    private tournamentService: YuGamesTournamentService,
    private route: ActivatedRoute
  ) {
    this.states = tournamentService.getStates();
    this.tournamentId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this.tournamentService.getById(this.tournamentId).subscribe(
      (data) => {
        this.tournament = data;
        this.loading = false;
      },
      (err) => {
        alert("Erreur lors de la récupération du tournoi.");
        console.error(err);
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
