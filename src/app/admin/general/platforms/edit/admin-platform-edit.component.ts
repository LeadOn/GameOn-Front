import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Platform } from '../../../../shared/classes/common/Platform';
import { GameOnPlatformService } from '../../../../shared/services/common/gameon-platform.service';
import { GameOnAdminService } from '../../../shared/services/gameon-admin.service';

@Component({
  selector: 'app-admin-platform-edit',
  templateUrl: './admin-platform-edit.component.html',
  styleUrls: ['./admin-platform-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AdminPlatformEditComponent implements OnInit {
  platformId: any;
  platform: Platform = new Platform();
  loading = true;

  feedbackOpen = false;
  feedbackType: 'success' | 'error' = 'success';
  feedbackTitle = '';
  feedbackMessage = '';
  feedbackAction: (() => void) | null = null;

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
        this.updatePlatformForm.controls['name'].setValue(data.name);
      },
      (err) => {
        console.error(err);
        this.loading = false;
        this.showFeedback(
          'error',
          'Erreur',
          'Une erreur est survenue lors de la récupération de la plateforme.',
        );
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
          this.showFeedback(
            'success',
            'Plateforme mise à jour',
            'Les informations de la plateforme ont été enregistrées avec succès.',
            () => this.router.navigate(['/admin/general/platforms']),
          );
        },
        (err) => {
          console.error(err);
          this.loading = false;
          this.showFeedback(
            'error',
            'Erreur',
            'Une erreur est survenue lors de la mise à jour de la plateforme.',
          );
        },
      );
    } else {
      this.showFeedback(
        'error',
        'Informations manquantes',
        'Certaines informations obligatoires sont manquantes.',
      );
    }
  }

  showFeedback(
    type: 'success' | 'error',
    title: string,
    message: string,
    action: (() => void) | null = null,
  ) {
    this.feedbackType = type;
    this.feedbackTitle = title;
    this.feedbackMessage = message;
    this.feedbackAction = action;
    this.feedbackOpen = true;
  }

  closeFeedback() {
    this.feedbackOpen = false;
    const action = this.feedbackAction;
    this.feedbackAction = null;

    if (action != null) {
      action();
    }
  }
}
