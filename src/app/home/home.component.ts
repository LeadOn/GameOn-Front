import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Player } from '../shared/classes/Player';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Season } from '../shared/classes/Season';
import { GameOnSeasonService } from '../shared/services/gameon-season.service';
import { environment } from '../../environments/environment';
import { GameOnPlayerService } from '../shared/services/gameon-player.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { GameOnTournamentService } from '../shared/services/gameon-tournament.service';
import { Tournament } from '../shared/classes/Tournament';
import { faExternalLinkAlt, faTrophy } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
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
})
export class HomeComponent implements OnInit {
  player$: Observable<Player>;
  isLoggedIn = false;
  isAdmin = false;
  version = environment.version;
  currentSeason?: Season;
  players: Player[] = [];
  archivedPlayers: Player[] = [];
  loadingSeason = true;
  loadingActivePlayers = true;
  loadingArchivedPlayers = true;
  tournaments: Tournament[] = [];
  tournamentIcon = faTrophy;
  externalIcon = faExternalLinkAlt;

  constructor(
    private keycloak: KeycloakService,
    private store: Store<{ player: Player }>,
    private seasonService: GameOnSeasonService,
    private playerService: GameOnPlayerService,
    private tournamentService: GameOnTournamentService
  ) {
    this.player$ = store.select('player');
  }

  ngOnInit(): void {
    this.seasonService.getCurrent().subscribe(
      (x) => {
        this.currentSeason = x;
        this.loadingSeason = false;
      },
      (err) => {
        console.error(err);
        alert('Erreur lors de la récupération de la saison en cours.');
      }
    );

    this.playerService.getAll().subscribe(
      (data) => {
        this.players = data;
        this.loadingActivePlayers = false;
      },
      (err) => {
        console.error(err);
      }
    );

    this.playerService.getAll(true).subscribe(
      (data) => {
        this.archivedPlayers = data;
        this.loadingArchivedPlayers = false;
      },
      (err) => {
        console.error(err);
      }
    );

    this.isLoggedIn = this.keycloak.isLoggedIn();

    if (this.isLoggedIn == true) {
      this.isAdmin = this.keycloak.isUserInRole('gameon_admin');
    }

    this.tournamentService.getFeatured().subscribe(
      (data) => {
        this.tournaments = data;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
