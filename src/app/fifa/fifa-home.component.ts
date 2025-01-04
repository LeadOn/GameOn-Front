import { Component, OnInit } from '@angular/core';
import {
  faChevronDown,
  faChevronRight,
  faExternalLinkAlt,
  faSoccerBall,
} from '@fortawesome/free-solid-svg-icons';
import { KeycloakService } from 'keycloak-angular';
import { Router } from '@angular/router';
import { GameOnPlatformService } from '../shared/services/common/gameon-platform.service';
import { Platform } from '../shared/classes/common/Platform';
import { FifaGamePlayed } from '../shared/classes/fifa/FifaGamePlayed';
import { GameOnGameService } from '../shared/services/fifa/gameon-game.service';

@Component({
  selector: 'app-fifa-home',
  templateUrl: './fifa-home.component.html',
  styleUrls: ['./fifa-home.component.scss'],
  standalone: false,
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
  showFilters = true;

  externalIcon = faExternalLinkAlt;
  footballIcon = faSoccerBall;
  rightChevronIcon = faChevronRight;
  downChevronIcon = faChevronDown;

  constructor(
    private gameService: GameOnGameService,
    private platformService: GameOnPlatformService,
    private keycloak: KeycloakService,
    private router: Router
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

  showFiltersClick() {
    this.showFilters = !this.showFilters;
  }

  createMatch() {
    if (this.isLoggedIn == false) {
      this.keycloak.login();
    } else {
      this.router.navigate(['/fifa/create']);
    }
  }
}
