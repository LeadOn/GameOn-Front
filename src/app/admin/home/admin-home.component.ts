import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { GameOnAdminService } from '../shared/services/gameon-admin.service';
import { AdminDashboard } from '../shared/classes/AdminDashboard';
import {
  faComputer,
  faRankingStar,
  faSoccerBall,
  faTrophy,
  faUserCircle,
  faVideo,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AdminHomeComponent implements OnInit {
  loading = true;
  platformIcon = faComputer;
  playerIcon = faUserCircle;
  soccerIcon = faSoccerBall;
  hightlightIcon = faVideo;
  seasonIcon = faRankingStar;
  tournamentIcon = faTrophy;

  stats: AdminDashboard = new AdminDashboard();

  constructor(private adminService: GameOnAdminService) {}

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
  }
}
