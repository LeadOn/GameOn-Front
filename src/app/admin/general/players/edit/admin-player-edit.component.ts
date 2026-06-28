import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Player } from '../../../../shared/classes/common/Player';
import { GameOnPlayerService } from '../../../../shared/services/common/gameon-player.service';
import { GameOnAdminService } from '../../../shared/services/gameon-admin.service';

@Component({
  selector: 'app-admin-player-edit',
  templateUrl: './admin-player-edit.component.html',
  styleUrls: ['./admin-player-edit.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AdminPlayerEditComponent implements OnInit {
  playerId: any;
  player: Player = new Player();
  loading = true;

  feedbackOpen = false;
  feedbackType: 'success' | 'error' = 'success';
  feedbackTitle = '';
  feedbackMessage = '';

  updatePlayerForm = new FormGroup({
    keycloakId: new FormControl('', [Validators.maxLength(50)]),
    fullName: new FormControl('', [
      Validators.required,
      Validators.maxLength(100),
    ]),
    nickname: new FormControl('', [
      Validators.required,
      Validators.maxLength(50),
    ]),
    profilePicUrl: new FormControl('', [
      Validators.required,
      Validators.maxLength(500),
    ]),
    archived: new FormControl(false, [Validators.required]),
  });

  constructor(
    private route: ActivatedRoute,
    private playerService: GameOnPlayerService,
    private adminService: GameOnAdminService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.playerId = this.route.snapshot.paramMap.get('id');

    this.playerService.get(this.playerId).subscribe(
      (data) => {
        this.loading = false;
        this.player = data;

        if (data.keycloakId != null) {
          this.updatePlayerForm.controls['keycloakId'].setValue(
            data.keycloakId,
          );
        }

        this.updatePlayerForm.controls['fullName'].setValue(data.fullName);
        this.updatePlayerForm.controls['nickname'].setValue(data.nickname);

        if (data.profilePictureUrl != null) {
          this.updatePlayerForm.controls['profilePicUrl'].setValue(
            data.profilePictureUrl,
          );
        }

        if (data.archived == null) {
          this.updatePlayerForm.controls['archived'].setValue(false);
        } else {
          this.updatePlayerForm.controls['archived'].setValue(data.archived);
        }
      },
      (err) => {
        console.error(err);
        alert('Une erreur est survenue lors de la récupération du joueur.');
        this.loading = false;
      },
    );
  }

  updatePlayer() {
    if (
      this.updatePlayerForm.controls['fullName'].value != null &&
      this.updatePlayerForm.controls['fullName'].value != '' &&
      this.updatePlayerForm.controls['nickname'].value != null &&
      this.updatePlayerForm.controls['nickname'].value != '' &&
      this.updatePlayerForm.controls['profilePicUrl'].value != null &&
      this.updatePlayerForm.controls['profilePicUrl'].value != ''
    ) {
      this.loading = true;

      let keycloakId: any = null;

      if (
        this.updatePlayerForm.controls['keycloakId'].value != null &&
        this.updatePlayerForm.controls['keycloakId'].value != ''
      ) {
        keycloakId = this.updatePlayerForm.controls['keycloakId'].value;
      }

      let archived = this.updatePlayerForm.controls['archived'].value;

      if (archived == null) {
        archived = false;
      }

      this.adminService
        .updatePlayer(
          this.playerId,
          this.updatePlayerForm.controls['fullName'].value,
          this.updatePlayerForm.controls['nickname'].value,
          this.updatePlayerForm.controls['profilePicUrl'].value,
          keycloakId,
          archived,
        )
        .subscribe(
          (data) => {
            this.loading = false;
            this.showFeedback(
              'success',
              'Joueur mis à jour',
              'Les informations du joueur ont été enregistrées avec succès.',
            );
          },
          (err) => {
            console.error(err);
            this.loading = false;
            this.showFeedback(
              'error',
              'Erreur',
              'Une erreur est survenue lors de la mise à jour du joueur.',
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

  showFeedback(type: 'success' | 'error', title: string, message: string) {
    this.feedbackType = type;
    this.feedbackTitle = title;
    this.feedbackMessage = message;
    this.feedbackOpen = true;
  }

  closeFeedback() {
    this.feedbackOpen = false;

    if (this.feedbackType == 'success') {
      this.router.navigate(['/admin/general/players']);
    }
  }
}
