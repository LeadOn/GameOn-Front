import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { Season } from '../../../shared/classes/fifa/Season';
import { GameOnSeasonService } from '../../../shared/services/fifa/gameon-season.service';

@Component({
  selector: 'app-admin-seasons',
  templateUrl: './admin-seasons.component.html',
  styleUrls: ['./admin-seasons.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AdminSeasonsComponent implements OnInit {
  seasons: Season[] = [];
  loading = true;

  constructor(private seasonService: GameOnSeasonService) {}

  ngOnInit(): void {
    this.seasonService.getAll().subscribe(
      (data) => {
        this.seasons = data;
        this.loading = false;
      },
      (err) => {
        alert('Une erreur est survenue lors de la récupération des saisons.');
        console.error(err);
        this.loading = false;
      },
    );
  }
}
