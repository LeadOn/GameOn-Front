import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Platform } from '../../../shared/classes/common/Platform';
import { GameOnPlatformService } from '../../../shared/services/common/gameon-platform.service';

@Component({
  selector: 'app-admin-platforms',
  templateUrl: './admin-platforms.component.html',
  styleUrls: ['./admin-platforms.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AdminPlatformsComponent implements OnInit {
  platforms: Platform[] = [];
  loading = true;
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
