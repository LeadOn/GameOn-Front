import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GameOnAdminService } from '../../shared/services/gameon-admin.service';
import { animate, style, transition, trigger } from '@angular/animations';
import { faUserCircle } from '@fortawesome/free-solid-svg-icons';
import { Player } from '../../../shared/classes/common/Player';
import { GameOnPlayerService } from '../../../shared/services/common/gameon-player.service';

@Component({
  selector: 'app-admin-player-edit',
  templateUrl: './admin-player-edit.component.html',
  styleUrls: ['./admin-player-edit.component.css'],
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
export class AdminPlayerEditComponent implements OnInit {
  playerId: any;
  player: Player = new Player();
  loading = true;
  playerIcon = faUserCircle;

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
            this.router.navigate(['/admin/players']);
          },
          (err) => {
            alert('Erreur lors de la mise à jour du joueur !');
            console.error(err);
            this.loading = false;
          },
        );
    } else {
      alert('Certaines informations sont manquantes !');
    }
  }
}
