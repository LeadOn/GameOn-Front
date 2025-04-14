import { Component, OnInit } from '@angular/core';
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
  selector: 'app-admin-fifa-home',
  templateUrl: './admin-fifa-home.component.html',
  styleUrls: ['./admin-fifa-home.component.css'],
  standalone: false,
})
export class AdminFifaHomeComponent implements OnInit {
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
