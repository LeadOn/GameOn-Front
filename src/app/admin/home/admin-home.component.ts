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
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
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
