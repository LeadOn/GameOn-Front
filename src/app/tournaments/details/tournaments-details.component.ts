import { Component, OnInit } from "@angular/core";
import { Tournament } from "src/app/shared/classes/Tournament";
import { YuGamesTournamentService } from "src/app/shared/services/yugames-tournament.service";
import { trigger, style, animate, transition } from "@angular/animations";
import { ActivatedRoute } from "@angular/router";
import { KeycloakService } from "keycloak-angular";
import { FifaTeam } from "src/app/shared/classes/FifaTeam";
import { YuGamesFifaTeamService } from "src/app/shared/services/yugames-fifateam.service";
import { YuGamesGameService } from "src/app/shared/services/yugames-game.service";
import { FifaGamePlayed } from "src/app/shared/classes/FifaGamePlayed";

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
  isLoggedIn = false;
  isSubscribed?: boolean;
  states: any[] = [];
  tournament?: Tournament;
  tournamentId: any;
  selectedTeam?: number;
  fifaTeams: FifaTeam[] = [];
  gamesPlayed: FifaGamePlayed[] = [];
  gamesToPlay: FifaGamePlayed[] = [];

  constructor(
    private tournamentService: YuGamesTournamentService,
    private route: ActivatedRoute,
    private keycloak: KeycloakService,
    private fifaTeamService: YuGamesFifaTeamService,
    private gameService: YuGamesGameService
  ) {
    this.states = tournamentService.getStates();
    this.tournamentId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this.keycloak.isLoggedIn().then((x) => {
      this.isLoggedIn = x;

      if (this.isLoggedIn == true) {
        this.tournamentService
          .checkPlayerSubscription(this.tournamentId)
          .subscribe(
            (x) => {
              this.isSubscribed = true;
            },
            (err) => {
              this.isSubscribed = false;

              this.fifaTeamService.getAll().subscribe(
                (data) => {
                  this.fifaTeams = data;
                  this.selectedTeam = data[0].id;
                },
                (err) => {
                  alert("Erreur lors de la récupération des équipes FIFA.");
                  console.error(err);
                }
              );
            }
          );
      }
    });

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

    this.gameService.getByTournament(this.tournamentId, false).subscribe(
      (data) => {
        this.gamesToPlay = data;
        this.gameService.getByTournament(this.tournamentId, true).subscribe(
          (data) => {
            this.gamesPlayed = data;
          },
          (err) => {
            console.error(err);
            alert("Erreur lors de la récupération des matchs.");
          }
        );
      },
      (err) => {
        console.error(err);
        alert("Erreur lors de la récupération des matchs.");
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

  subscribe() {
    if (
      this.selectedTeam != undefined &&
      confirm(
        "Êtes vous sûr de vouloir vous inscrire à ce tournoi cette équipe ?"
      )
    ) {
      this.loading = true;
      this.tournamentService
        .subscribe(this.tournamentId, this.selectedTeam)
        .subscribe(
          (x) => {
            this.loading = false;
            alert("Inscription réussie !");
            window.location.reload();
          },
          (err) => {
            alert("Erreur lors de l'inscription !");
            console.error(err);
          }
        );
    }
  }
}
