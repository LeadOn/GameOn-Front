import { Component, OnInit } from '@angular/core';
import { GameOnAdminService } from '../shared/services/gameon-admin.service';
import { AdminDashboard } from '../shared/classes/AdminDashboard';

@Component({
  selector: 'app-admin-home',
  templateUrl: './admin-home.component.html',
  styleUrls: ['./admin-home.component.scss'],
})
export class AdminHomeComponent implements OnInit {
  loading = true;

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
          'Une erreur est survenue lors de la récupération des statistiques.'
        );
        console.error(err);
      }
    );
  }
}
