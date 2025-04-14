import { Component, OnInit } from '@angular/core';
import { animate, style, transition, trigger } from '@angular/animations';
import { faComputer, faEdit } from '@fortawesome/free-solid-svg-icons';
import { Platform } from '../../../shared/classes/common/Platform';
import { GameOnPlatformService } from '../../../shared/services/common/gameon-platform.service';

@Component({
  selector: 'app-admin-platforms',
  templateUrl: './admin-platforms.component.html',
  styleUrls: ['./admin-platforms.component.css'],
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
export class AdminPlatformsComponent implements OnInit {
  platforms: Platform[] = [];
  loading = true;
  platformIcon = faComputer;
  editIcon = faEdit;

  constructor(private platformService: GameOnPlatformService) {}

  ngOnInit(): void {
    this.platformService.getAll().subscribe(
      (data) => {
        this.platforms = data;
        this.loading = false;
      },
      (err) => {
        alert(
          'Une erreur est survenue lors de la récupération des plateformes.',
        );
        console.error(err);
        this.loading = false;
      },
    );
  }
}
