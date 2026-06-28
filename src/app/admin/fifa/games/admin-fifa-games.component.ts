import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FifaGamePlayed } from '../../../shared/classes/fifa/FifaGamePlayed';
import { GameOnGameService } from '../../../shared/services/fifa/gameon-game.service';
import { GameOnPlatformService } from '../../../shared/services/common/gameon-platform.service';
import { Platform } from '../../../shared/classes/common/Platform';
import {
  faChevronLeft,
  faChevronRight,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';

const RESULTS_LIMIT = 100;
const PAGE_SIZE = 8;

@Component({
  selector: 'app-admin-fifa-games',
  templateUrl: './admin-fifa-games.component.html',
  styleUrls: ['./admin-fifa-games.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AdminFifaGamesComponent implements OnInit {
  games: FifaGamePlayed[] = [];
  platforms: Platform[] = [];
  loading = true;
  isAdmin = true;

  searchIcon = faMagnifyingGlass;
  previousIcon = faChevronLeft;
  nextIcon = faChevronRight;

  platformId = 0;
  startDate = '';
  endDate = '';

  page = 1;
  pageSize = PAGE_SIZE;

  constructor(
    private gameService: GameOnGameService,
    private platformService: GameOnPlatformService,
  ) {}

  ngOnInit(): void {
    this.platformService.getAll().subscribe(
      (data) => {
        this.platforms = data;
      },
      (err) => {
        console.error(err);
      },
    );

    this.getGames();
  }

  getGames() {
    this.loading = true;
    this.page = 1;
    this.gameService
      .search(
        RESULTS_LIMIT,
        this.platformId || undefined,
        this.startDate,
        this.endDate,
      )
      .subscribe(
        (data) => {
          this.games = data;
          this.loading = false;
        },
        (err) => {
          alert('Une erreur est survenue lors de la récupération des matchs.');
          console.error(err);
          this.loading = false;
        },
      );
  }

  resetFilters() {
    this.platformId = 0;
    this.startDate = '';
    this.endDate = '';
    this.getGames();
  }

  get totalPages(): number {
    return Math.max(1, Math.ceil(this.games.length / this.pageSize));
  }

  get pagedGames(): FifaGamePlayed[] {
    const start = (this.page - 1) * this.pageSize;
    return this.games.slice(start, start + this.pageSize);
  }

  previousPage() {
    if (this.page > 1) {
      this.page--;
    }
  }

  nextPage() {
    if (this.page < this.totalPages) {
      this.page++;
    }
  }
}
