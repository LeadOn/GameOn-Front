import { Component, OnInit } from "@angular/core";
import { YuGamesTournamentService } from "../shared/services/yugames-tournament.service";
import { Tournament } from "../shared/classes/Tournament";
import { trigger, style, animate, transition } from "@angular/animations";

@Component({
  selector: "app-tournaments-home",
  templateUrl: "./tournaments-home.component.html",
  styleUrls: ["./tournaments-home.component.scss"],
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
export class TournamentsHomeComponent implements OnInit {
  loading = false;
  states: any[] = [];
  tournaments: Tournament[] = [];

  constructor(private tournamentService: YuGamesTournamentService) {
    this.states = tournamentService.getStates();
  }

  ngOnInit(): void {
    this.tournamentService.getAll().subscribe(
      (data) => {
        this.tournaments = data;
      },
      (err) => {
        alert("Erreur lors de la récupération des tournois.");
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
