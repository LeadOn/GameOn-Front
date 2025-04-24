import { Component, inject, OnInit, signal } from '@angular/core';
import {
  faChevronDown,
  faChevronRight,
  faExternalLinkAlt,
  faSoccerBall,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import Keycloak from 'keycloak-js';
import { Platform } from '../../shared/classes/common/Platform';
import { FifaGamePlayed } from '../../shared/classes/fifa/FifaGamePlayed';
import { GameOnGameService } from '../../shared/services/fifa/gameon-game.service';
import { GameOnPlatformService } from '../../shared/services/common/gameon-platform.service';
import { Player } from '../../shared/classes/common/Player';
import { GameOnPlayerService } from '../../shared/services/common/gameon-player.service';

@Component({
  selector: 'app-fifa-home',
  templateUrl: './fifa-home.component.html',
  styleUrls: ['./fifa-home.component.css'],
  standalone: false,
})
export class FifaHomeComponent implements OnInit {
  private readonly keycloak = inject(Keycloak);

  loading = true;
  playersLoading = true;
  gamesLoading = true;
  isLoggedIn = false;
  platformLoadingError = false;
  playersLoadingError = false;
  gamesLoadingError = false;

  games: FifaGamePlayed[] = [];
  platforms: Platform[] = [];
  players: Player[] = [];

  platformId = 0;
  numberOfGames = 10;
  startDate = undefined;
  endDate = undefined;

  externalIcon = faExternalLinkAlt;
  footballIcon = faSoccerBall;
  rightChevronIcon = faChevronRight;
  downChevronIcon = faChevronDown;
  errorIcon = faTriangleExclamation;

  showFilters = signal<boolean>(
    JSON.parse(
      window.localStorage.getItem('gameon-fifa-show-filters') ?? 'false',
    ),
  );

  showPlayers = signal<boolean>(
    JSON.parse(
      window.localStorage.getItem('gameon-fifa-show-players') ?? 'false',
    ),
  );

  constructor(
    private gameService: GameOnGameService,
    private platformService: GameOnPlatformService,
    private playerService: GameOnPlayerService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn =
      this.keycloak.authenticated != null && this.keycloak.authenticated
        ? true
        : false;
    this.loading = true;
    this.getPlatforms();
    this.getPlayers();
    this.getGames();
  }

  getPlayers() {
    this.playerService.getAll().subscribe(
      (data) => {
        this.players = data;
        this.playersLoading = false;
      },
      (err) => {
        this.playersLoadingError = true;
        this.playersLoading = false;
        console.error(err);
      },
    );
  }

  getPlatforms() {
    this.platformService.getAll().subscribe(
      (data) => {
        this.platforms = data;
      },
      (err) => {
        this.platformLoadingError = true;
        console.error(err);
      },
    );
  }

  getGames() {
    this.games.length = 0;
    this.gamesLoading = true;
    this.gameService.getLast(this.numberOfGames).subscribe(
      (data) => {
        this.games = data;
        this.gamesLoading = false;
      },
      (err) => {
        this.gamesLoadingError = true;
        this.gamesLoading = false;
        console.error('[FifaHistory]', err);
      },
    );
  }

  searchGame() {
    this.games.length = 0;
    this.gamesLoading = true;
    this.gameService
      .search(this.numberOfGames, this.platformId, this.startDate, this.endDate)
      .subscribe(
        (data) => {
          this.games = data;
          this.gamesLoading = false;
        },
        (err) => {
          this.gamesLoading = false;
          this.gamesLoadingError = true;
          console.error('[FifaHistory]', err);
        },
      );
  }

  showFiltersClick() {
    this.showFilters.update((prev) => !prev);
    window.localStorage.setItem(
      'gameon-fifa-show-filters',
      JSON.stringify(this.showFilters()),
    );
  }

  showPlayersClick() {
    this.showPlayers.update((prev) => !prev);
    window.localStorage.setItem(
      'gameon-fifa-show-players',
      JSON.stringify(this.showPlayers()),
    );
  }

  createMatch() {
    if (this.isLoggedIn == false) {
      this.keycloak.login();
    } else {
      this.router.navigate(['/fifa/create']);
    }
  }
}
