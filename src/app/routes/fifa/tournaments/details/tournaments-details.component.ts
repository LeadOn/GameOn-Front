import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import {
  faCheck,
  faChevronDown,
  faChevronRight,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import Keycloak from 'keycloak-js';
import { TournamentPlayerDto } from '../../../../shared/classes/fifa/TournamentPlayerDto';
import { Tournament } from '../../../../shared/classes/fifa/Tournament';
import { FifaTeam } from '../../../../shared/classes/fifa/FifaTeam';
import { FifaGamePlayed } from '../../../../shared/classes/fifa/FifaGamePlayed';
import { GameOnTournamentService } from '../../../../shared/services/fifa/gameon-tournament.service';
import { GameOnFifaTeamService } from '../../../../shared/services/fifa/gameon-fifateam.service';
import { GameOnGameService } from '../../../../shared/services/fifa/gameon-game.service';
import { Player } from '../../../../shared/classes/common/Player';

@Component({
  selector: 'app-tournaments-details',
  templateUrl: './tournaments-details.component.html',
  styleUrls: ['./tournaments-details.component.css'],
  standalone: false,
})
export class TournamentsDetailsComponent implements OnInit {
  private readonly keycloak = inject(Keycloak);

  loading = true;
  isLoggedIn = false;
  isAdmin = false;
  isSubscribed?: TournamentPlayerDto;
  states: any[] = [];
  tournament?: Tournament;
  tournamentId: any;
  selectedTeam?: number;
  fifaTeams: FifaTeam[] = [];
  gamesPlayed: FifaGamePlayed[] = [];
  gamesToPlay: FifaGamePlayed[] = [];
  myGamesToPlay: FifaGamePlayed[] = [];
  trophyIcon = faTrophy;
  checkIcon = faCheck;
  rightChevronIcon = faChevronRight;
  downChevronIcon = faChevronDown;

  statePillColor = 'primary';

  playersShown = true;
  plannedMatchsShown = false;
  matchsPlayedShown = false;
  myMatchsToPlayShown = false;
  tournamentBracketShown = false;
  showDetails = true;
  showRules = false;

  constructor(
    private tournamentService: GameOnTournamentService,
    private route: ActivatedRoute,
    private fifaTeamService: GameOnFifaTeamService,
    private gameService: GameOnGameService,
    private store: Store<{ player: Player }>,
  ) {
    this.states = tournamentService.getStates();
    this.tournamentId = this.route.snapshot.paramMap.get('id');
    this.isAdmin = this.keycloak.hasRealmRole('gameon_admin');
  }

  ngOnInit(): void {
    this.isLoggedIn =
      this.keycloak.authenticated != null && this.keycloak.authenticated
        ? true
        : false;

    if (this.isLoggedIn == true) {
      this.tournamentService
        .checkPlayerSubscription(this.tournamentId)
        .subscribe(
          (x) => {
            this.isSubscribed = x;
          },
          (err) => {
            console.error(
              '[TournamentDetailsComponent] Player is not subscribe to tournament.]',
            );
          },
        );

      this.fifaTeamService.getAll().subscribe(
        (data) => {
          this.fifaTeams = data;
          this.selectedTeam = data[0].id;
        },
        (err) => {
          alert('Erreur lors de la récupération des équipes FIFA.');
          console.error(err);
        },
      );
    }

    this.tournamentService.getById(this.tournamentId).subscribe(
      (data) => {
        this.tournament = data;

        switch (this.tournament.state) {
          case 0:
            this.statePillColor = 'gray';
            break;

          case 1:
            this.statePillColor = 'green';
            break;

          case 2:
            this.statePillColor = 'secondary';
            break;

          case 3:
            this.statePillColor = 'yellow';
            break;

          case 4:
            this.statePillColor = 'green';
            break;

          default:
            break;
        }

        if (
          this.tournament.phase2ChallongeUrl != null &&
          this.tournament.phase2ChallongeUrl != ''
        ) {
          this.tournamentBracketShown = true;
        }
        this.loading = false;
      },
      (err) => {
        alert('Erreur lors de la récupération du tournoi.');
        console.error(err);
      },
    );

    this.gameService.getByTournament(this.tournamentId, false).subscribe(
      (data) => {
        this.gamesToPlay = data;

        if (this.isLoggedIn == true) {
          this.store.subscribe((player) => {
            this.gamesToPlay.forEach((game) => {
              if (
                game.team1.players.find((x) => x.id == player.player.id) !=
                  undefined ||
                game.team2.players.find((x) => x.id == player.player.id) !=
                  undefined
              ) {
                this.myGamesToPlay.push(game);
              }
            });
          });
        }

        this.gameService.getByTournament(this.tournamentId, true).subscribe(
          (data) => {
            this.gamesPlayed = data;
          },
          (err) => {
            console.error(err);
            alert('Erreur lors de la récupération des matchs.');
          },
        );
      },
      (err) => {
        console.error(err);
        alert('Erreur lors de la récupération des matchs.');
      },
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

  showMyMatchsToPlay() {
    this.myMatchsToPlayShown = !this.myMatchsToPlayShown;
  }

  showTournamentBracket() {
    this.tournamentBracketShown = !this.tournamentBracketShown;
  }

  showDetailsContent() {
    this.showDetails = !this.showDetails;
  }

  showRulesContent() {
    this.showRules = !this.showRules;
  }

  getState(stateId: number): string {
    let label = 'Inconnu';
    this.states.forEach((x) => {
      if (x.value == stateId) {
        label = x.label;
      }
    });

    return label;
  }

  subscribe() {
    if (this.selectedTeam != undefined) {
      this.loading = true;
      this.tournamentService
        .subscribe(this.tournamentId, this.selectedTeam)
        .subscribe(
          (x) => {
            this.loading = false;
            window.location.reload();
          },
          (err) => {
            alert("Erreur lors de l'inscription !");
            console.error(err);
          },
        );
    }
  }

  updateSubscription() {
    if (this.selectedTeam != undefined) {
      this.loading = true;
      this.tournamentService
        .updateSubscription(this.tournamentId, this.selectedTeam)
        .subscribe(
          (x) => {
            this.loading = false;
            window.location.reload();
          },
          (err) => {
            alert("Erreur lors de la modification de l'inscription !");
            console.error(err);
          },
        );
    }
  }
}
