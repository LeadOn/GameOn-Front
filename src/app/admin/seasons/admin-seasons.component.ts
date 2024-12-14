import { Component, OnInit } from '@angular/core';
import { Season } from '../../shared/classes/Season';
import { GameOnSeasonService } from '../../shared/services/gameon-season.service';
import { faRankingStar } from '@fortawesome/free-solid-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';

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
