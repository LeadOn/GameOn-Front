import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameOnAdminService } from '../shared/services/gameon-admin.service';
import { GameOnGameService } from '../../shared/services/fifa/gameon-game.service';
import { AdminDashboard } from '../shared/classes/AdminDashboard';
import { FifaGamePlayed } from '../../shared/classes/fifa/FifaGamePlayed';
import {
  faChevronLeft,
  faChevronRight,
  faSoccerBall,
  faTrophy,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';

const HISTORY_LIMIT = 50;
const HISTORY_PAGE_SIZE = 5;

@Component({
  selector: 'app-admin-fifa-home',
  templateUrl: './admin-fifa-home.component.html',
  styleUrls: ['./admin-fifa-home.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AdminFifaHomeComponent implements OnInit {
  loading = true;
  historyLoading = true;

  soccerIcon = faSoccerBall;
  hightlightIcon = faVideo;
  tournamentIcon = faTrophy;
  previousIcon = faChevronLeft;
  nextIcon = faChevronRight;

  stats: AdminDashboard = new AdminDashboard();

  games: FifaGamePlayed[] = [];
  page = 1;
  pageSize = HISTORY_PAGE_SIZE;

  constructor(
    private adminService: GameOnAdminService,
    private gameService: GameOnGameService,
  ) {}

  ngOnInit(): void {
    this.adminService.getDashboardStats().subscribe(
      (data) => {
        this.loading = false;
        this.stats = data;
      },
      (err) => {
        this.loading = false;
        alert(
          'Une erreur est survenue lors de la récupération des statistiques.',
        );
        console.error(err);
      },
    );

    this.gameService.getLast(HISTORY_LIMIT).subscribe(
      (data) => {
        this.games = data;
        this.historyLoading = false;
      },
      (err) => {
        this.historyLoading = false;
        alert('Une erreur est survenue lors de la récupération des matchs.');
        console.error(err);
      },
    );
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
