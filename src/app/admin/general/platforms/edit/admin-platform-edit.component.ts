import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { animate, style, transition, trigger } from '@angular/animations';
import { faComputer } from '@fortawesome/free-solid-svg-icons';
import { Platform } from '../../../../shared/classes/common/Platform';
import { GameOnPlatformService } from '../../../../shared/services/common/gameon-platform.service';
import { GameOnAdminService } from '../../../shared/services/gameon-admin.service';

@Component({
  selector: 'app-admin-platform-edit',
  templateUrl: './admin-platform-edit.component.html',
  styleUrls: ['./admin-platform-edit.component.css'],
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
export class AdminPlatformEditComponent implements OnInit {
  platformId: any;
  platform: Platform = new Platform();
  loading = true;
  platformIcon = faComputer;

  updatePlatformForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.maxLength(50)]),
  });

  constructor(
    private route: ActivatedRoute,
    private platformService: GameOnPlatformService,
    private adminService: GameOnAdminService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.platformId = this.route.snapshot.paramMap.get('id');

    this.platformService.getById(this.platformId).subscribe(
      (data) => {
        this.loading = false;
        this.platform = data;
      },
      (err) => {
        console.error(err);
        alert(
          'Une erreur est survenue lors de la récupération de la plateforme.',
        );
        this.loading = false;
      },
    );
  }

  updatePlatform() {
    let platform = new Platform();
    platform.id = this.platformId;

    if (this.updatePlatformForm.controls['name'].value != null) {
      platform.name = this.updatePlatformForm.controls['name'].value;
    }

    if (
      platform.id != 0 &&
      platform.name != null &&
      platform.name != 'UNKNOWN' &&
      this.loading == false
    ) {
      this.loading = true;
      this.adminService.updatePlatform(platform).subscribe(
        (data) => {
          this.loading = false;
          this.router.navigate(['/admin/general/platforms']);
        },
        (err) => {
          alert(
            'Erreur lors de la mise à jour de la plateforme ! Erreur : ' + err,
          );
          this.loading = false;
        },
      );
    } else {
      alert('Certaines informations sont manquantes !');
    }
  }
}
