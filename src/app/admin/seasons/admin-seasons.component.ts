import { Component, OnInit } from '@angular/core';
import { faRankingStar } from '@fortawesome/free-solid-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';
import { Season } from '../../shared/classes/fifa/Season';
import { GameOnSeasonService } from '../../shared/services/fifa/gameon-season.service';

@Component({
  selector: 'app-admin-seasons',
  templateUrl: './admin-seasons.component.html',
  styleUrls: ['./admin-seasons.component.scss'],
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
export class AdminSeasonsComponent implements OnInit {
  seasons: Season[] = [];
  loading = true;
  seasonIcon = faRankingStar;

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
      }
    );
  }
}
