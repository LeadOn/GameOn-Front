import { Component, OnInit } from "@angular/core";
import { YuGamesTournamentService } from "../shared/services/yugames-tournament.service";
import { Tournament } from "../shared/classes/Tournament";

@Component({
  selector: "app-tournaments-home",
  templateUrl: "./tournaments-home.component.html",
  styleUrls: ["./tournaments-home.component.scss"],
})
export class TournamentsHomeComponent implements OnInit {
  loading = false;
  tournaments: Tournament[] = [];

  constructor(private tournamentService: YuGamesTournamentService) {}

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
}
