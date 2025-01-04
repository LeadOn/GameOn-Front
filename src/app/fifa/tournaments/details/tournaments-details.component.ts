import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
import { ActivatedRoute } from '@angular/router';
import { KeycloakService } from 'keycloak-angular';
import { FifaTeam } from '../../../shared/classes/FifaTeam';
import { GameOnFifaTeamService } from '../../../shared/services/gameon-fifateam.service';
import { GameOnGameService } from '../../../shared/services/gameon-game.service';
import { FifaGamePlayed } from '../../../shared/classes/FifaGamePlayed';
import { Store } from '@ngrx/store';
import {
  faCheck,
  faChevronDown,
  faChevronRight,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import { GameOnTournamentService } from '../../../shared/services/fifa/gameon-tournament.service';
import { TournamentPlayerDto } from '../../../shared/classes/fifa/TournamentPlayerDto';
import { Tournament } from '../../../shared/classes/fifa/Tournament';
import { Player } from '../../../shared/classes/common/Player';

@Component({
  selector: 'app-tournaments-details',
  templateUrl: './tournaments-details.component.html',
  styleUrls: ['./tournaments-details.component.scss'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(200, style({ opacity: 0 })),
      ]),
    ]),
  ],
  standalone: false,
})
export class TournamentsDetailsComponent implements OnInit {
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
  subscriptionShown = false;
  showDetails = true;
  showRules = false;

  constructor(
    private tournamentService: GameOnTournamentService,
    private route: ActivatedRoute,
    private keycloak: KeycloakService,
    private fifaTeamService: GameOnFifaTeamService,
    private gameService: GameOnGameService,
    private store: Store<{ player: Player }>
  ) {
    this.states = tournamentService.getStates();
    this.tournamentId = this.route.snapshot.paramMap.get('id');
    this.isAdmin = this.keycloak.isUserInRole('gameon_admin');
  }

  ngOnInit(): void {
    this.isLoggedIn = this.keycloak.isLoggedIn();

    if (this.isLoggedIn == true) {
      this.tournamentService
        .checkPlayerSubscription(this.tournamentId)
        .subscribe(
          (x) => {
            this.isSubscribed = x;
            if (this.isSubscribed == undefined) {
              this.subscriptionShown = true;
            }
          },
          (err) => {
            console.error(
              '[TournamentDetailsComponent] Player is not subscribe to tournament.]'
            );
            this.subscriptionShown = true;
          }
        );

      this.fifaTeamService.getAll().subscribe(
        (data) => {
          this.fifaTeams = data;
          this.selectedTeam = data[0].id;
        },
        (err) => {
          alert('Erreur lors de la récupération des équipes FIFA.');
          console.error(err);
        }
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
      }
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
          }
        );
      },
      (err) => {
        console.error(err);
        alert('Erreur lors de la récupération des matchs.');
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

  showMyMatchsToPlay() {
    this.myMatchsToPlayShown = !this.myMatchsToPlayShown;
  }

  showTournamentBracket() {
    this.tournamentBracketShown = !this.tournamentBracketShown;
  }

  showSubscription() {
    this.subscriptionShown = !this.subscriptionShown;
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
          }
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
          }
        );
    }
  }
}
