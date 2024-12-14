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
import {
  faExternalLinkAlt,
  faInfoCircle,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';
import { PlatformStatsDto } from '../shared/classes/PlatformStatsDto';
import { setPlayerStats } from '../store/actions/player.actions';

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
  globalStats$: Observable<PlatformStatsDto>;
  isLoggedIn = false;
  isAdmin = false;
  version = environment.version;
  currentSeason?: Season;
  players: Player[] = [];
  loadingSeason = true;
  loadingActivePlayers = true;

  tournaments: Tournament[] = [];
  tournamentIcon = faTrophy;
  externalIcon = faExternalLinkAlt;
  infoIcon = faInfoCircle;

  constructor(
    private keycloak: KeycloakService,
    private store: Store<{ player: Player }>,
    private statsStore: Store<{ globalStats: PlatformStatsDto }>,
    private seasonService: GameOnSeasonService,
    private playerService: GameOnPlayerService,
    private tournamentService: GameOnTournamentService
  ) {
    this.player$ = store.select('player');
    this.globalStats$ = statsStore.select('globalStats');
    this.isLoggedIn = this.keycloak.isLoggedIn();

    if (this.isLoggedIn == true) {
      this.isAdmin = this.keycloak.isUserInRole('gameon_admin');
    }
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

    this.tournamentService.getFeatured().subscribe(
      (data) => {
        this.tournaments = data;
      },
      (err) => {
        console.error(err);
      }
    );

    if (this.isLoggedIn) {
      this.player$.subscribe((x) => {
        this.playerService.getStats(x.id).subscribe((data) => {
          if (
            data != null &&
            data.statsPerPlatform != null &&
            data.statsPerPlatform.length > 0
          ) {
            this.statsStore.dispatch(
              setPlayerStats({ globalStats: data.statsPerPlatform[0] })
            );
          }
        });
      });
    }
  }
}
