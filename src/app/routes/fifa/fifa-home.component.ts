import { Component, inject, OnInit } from '@angular/core';
import {
  faChevronDown,
  faChevronRight,
  faExternalLinkAlt,
  faSoccerBall,
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
  games: FifaGamePlayed[] = [];
  platforms: Platform[] = [];
  platformId = 0;
  isLoggedIn = false;
  numberOfGames = 10;
  startDate = undefined;
  endDate = undefined;
  showFilters = true;

  showPlayers = false;
  players: Player[] = [];

  externalIcon = faExternalLinkAlt;
  footballIcon = faSoccerBall;
  rightChevronIcon = faChevronRight;
  downChevronIcon = faChevronDown;

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
        alert('Erreur lors de la récupération des plateformes.');
        console.error(err);
      },
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
          'Une erreur est survenue lors de la récupération des matchs joués.',
        );
      },
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
            'Une erreur est survenue lors de la récupération des matchs joués.',
          );
        },
      );
  }

  showFiltersClick() {
    this.showFilters = !this.showFilters;
  }

  showPlayersClick() {
    this.showPlayers = !this.showPlayers;
  }

  createMatch() {
    if (this.isLoggedIn == false) {
      this.keycloak.login();
    } else {
      this.router.navigate(['/fifa/create']);
    }
  }
}
