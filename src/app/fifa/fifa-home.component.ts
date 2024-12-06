import { Component, OnInit } from '@angular/core';
import {
  faExternalLinkAlt,
  faSoccerBall,
} from '@fortawesome/free-solid-svg-icons';
import { KeycloakService } from 'keycloak-angular';
import { FifaGamePlayed } from '../shared/classes/FifaGamePlayed';
import { Platform } from '../shared/classes/Platform';
import { GameOnGameService } from '../shared/services/gameon-game.service';
import { GameOnPlatformService } from '../shared/services/gameon-platform.service';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-fifa-home',
  templateUrl: './fifa-home.component.html',
  styleUrls: ['./fifa-home.component.scss'],
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
export class FifaHomeComponent implements OnInit {
  loading = true;
  games: FifaGamePlayed[] = [];
  platforms: Platform[] = [];
  platformId = 0;
  isLoggedIn = false;
  numberOfGames = 10;
  startDate = undefined;
  endDate = undefined;

  externalIcon = faExternalLinkAlt;
  footballIcon = faSoccerBall;

  constructor(
    private gameService: GameOnGameService,
    private platformService: GameOnPlatformService,
    private keycloak: KeycloakService
  ) {}

  ngOnInit(): void {
    this.isLoggedIn = this.keycloak.isLoggedIn();
    this.loading = true;
    this.getPlatforms();
    this.getGames();
  }

  getPlatforms() {
    this.platformService.getAll().subscribe(
      (data) => {
        this.platforms = data;
      },
      (err) => {
        alert('Erreur lors de la récupération des plateformes.');
        console.error(err);
      }
    );
  }

  getGames() {
    this.games.length = 0;
    this.loading = true;
    this.gameService.getLast(this.numberOfGames).subscribe(
      (data) => {
        this.games = data;
        this.loading = false;
      },
      (err) => {
        console.error('[FifaHistory]', err);
        alert(
          'Une erreur est survenue lors de la récupération des matchs joués.'
        );
      }
    );
  }

  searchGame() {
    this.games.length = 0;
    this.loading = true;
    this.gameService
      .search(this.numberOfGames, this.platformId, this.startDate, this.endDate)
      .subscribe(
        (data) => {
          this.games = data;
          this.loading = false;
        },
        (err) => {
          console.error('[FifaHistory]', err);
          alert(
            'Une erreur est survenue lors de la récupération des matchs joués.'
          );
        }
      );
  }
}
