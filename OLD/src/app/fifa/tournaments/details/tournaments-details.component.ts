import {Component, OnInit} from "@angular/core";
import {Tournament} from "src/app/shared/classes/Tournament";
import {GameOnTournamentService} from "src/app/shared/services/gameon-tournament.service";
import {trigger, style, animate, transition} from "@angular/animations";
import {ActivatedRoute} from "@angular/router";
import {KeycloakService} from "keycloak-angular";
import {FifaTeam} from "src/app/shared/classes/FifaTeam";
import {GameOnFifaTeamService} from "src/app/shared/services/gameon-fifateam.service";
import {GameOnGameService} from "src/app/shared/services/gameon-game.service";
import {FifaGamePlayed} from "src/app/shared/classes/FifaGamePlayed";
import {TournamentPlayerDto} from "src/app/shared/classes/TournamentPlayerDto";

@Component({
  selector: "app-tournaments-details",
  templateUrl: "./tournaments-details.component.html",
  styleUrls: ["./tournaments-details.component.scss"],
  animations: [
    trigger("inOutAnimation", [
      transition(":enter", [
        style({opacity: 0}),
        animate(200, style({opacity: 1})),
      ]),
      transition(":leave", [
        style({opacity: 1}),
        animate(200, style({opacity: 0})),
      ]),
    ]),
  ],
})
export class TournamentsDetailsComponent implements OnInit {
  loading = true;
  isLoggedIn = false;
  isSubscribed?: TournamentPlayerDto;
  states: any[] = [];
  tournament?: Tournament;
  tournamentId: any;
  selectedTeam?: number;
  fifaTeams: FifaTeam[] = [];
  gamesPlayed: FifaGamePlayed[] = [];
  gamesToPlay: FifaGamePlayed[] = [];

  playersShown = true;
  plannedMatchsShown = false;
  matchsPlayedShown = false;

  constructor(
    private tournamentService: GameOnTournamentService,
    private route: ActivatedRoute,
    private keycloak: KeycloakService,
    private fifaTeamService: GameOnFifaTeamService,
    private gameService: GameOnGameService
  ) {
    this.states = tournamentService.getStates();
    this.tournamentId = this.route.snapshot.paramMap.get("id");
  }

  ngOnInit(): void {
    this.isLoggedIn = this.keycloak.isLoggedIn();

    if (this.isLoggedIn == true) {
      this.tournamentService
        .checkPlayerSubscription(this.tournamentId)
        .subscribe(
          (x) => {
            this.isSubscribed = x;
          },
          (err) => {
            console.log(
              "[TournamentDetailsComponent] Player is not subscribe to tournament.]"
            );
          }
        );

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

  showPlayers() {
    this.playersShown = !this.playersShown;
  }

  showMatchsPlanned() {
    this.plannedMatchsShown = !this.plannedMatchsShown;
  }

  showMatchsPlayed() {
    this.matchsPlayedShown = !this.matchsPlayedShown;
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

  updateSubscription() {
    if (
      this.selectedTeam != undefined &&
      confirm(
        "Êtes vous sûr de vouloir modifier votre inscription à ce tournoi avec cette nouvelle équipe ?"
      )
    ) {
      this.loading = true;
      this.tournamentService
        .updateSubscription(this.tournamentId, this.selectedTeam)
        .subscribe(
          (x) => {
            this.loading = false;
            alert("Inscription modifiée !");
            window.location.reload();
          },
          (err) => {
            alert("Erreur lors de la modification de l'inscription !");
            console.error(err);
          }
        );
    }
  }
}
