import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Tournament } from '../../../../shared/classes/fifa/Tournament';
import { GameOnAdminService } from '../../../shared/services/gameon-admin.service';
import { GameOnTournamentService } from '../../../../shared/services/fifa/gameon-tournament.service';
@Component({
  selector: 'app-admin-edit-tournament-edit',
  templateUrl: './admin-edit-tournament.component.html',
  styleUrls: ['./admin-edit-tournament.component.css'],
  standalone: false,
})
export class AdminEditTournamentComponent implements OnInit {
  loading = true;
  tournamentId: any;
  tournament?: Tournament;
  states: any[] = [];

  currentFile?: File;

  editTournamentForm = new FormGroup({
    name: new FormControl('', [Validators.maxLength(100), Validators.required]),
    description: new FormControl('', [Validators.maxLength(5000)]),
    state: new FormControl(0, [Validators.required]),
    phase2ChallongeUrl: new FormControl('', [Validators.maxLength(3000)]),
    plannedFrom: new FormControl('', [Validators.required]),
    plannedTo: new FormControl('', [Validators.required]),
    winnerId: new FormControl(0),
    winPoints: new FormControl(0),
    loosePoints: new FormControl(0),
    drawPoints: new FormControl(0),
    rules: new FormControl('', [Validators.maxLength(5000)]),
    featured: new FormControl(false),
  });

  constructor(
    private adminService: GameOnAdminService,
    private tournamentService: GameOnTournamentService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    this.states = this.tournamentService.getStates();
    this.tournamentId = this.route.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.tournamentService.getById(this.tournamentId).subscribe(
      (data) => {
        this.tournament = data;

        this.editTournamentForm.controls['name'].setValue(data.name);
        this.editTournamentForm.controls['state'].setValue(data.state);
        this.editTournamentForm.controls['plannedFrom'].setValue(
          data.plannedFrom.toString(),
        );
        this.editTournamentForm.controls['plannedTo'].setValue(
          data.plannedTo.toString(),
        );

        this.editTournamentForm.controls['winPoints'].setValue(
          this.tournament.winPoints,
        );

        this.editTournamentForm.controls['loosePoints'].setValue(
          this.tournament.loosePoints,
        );

        this.editTournamentForm.controls['drawPoints'].setValue(
          this.tournament.drawPoints,
        );

        this.editTournamentForm.controls['featured'].setValue(
          this.tournament.featured,
        );

        if (data.description != null) {
          this.editTournamentForm.controls['description'].setValue(
            data.description,
          );
        }

        if (data.rules != null) {
          this.editTournamentForm.controls['rules'].setValue(data.rules);
        }

        if (data.phase2ChallongeUrl != null) {
          this.editTournamentForm.controls['phase2ChallongeUrl'].setValue(
            data.phase2ChallongeUrl,
          );
        }

        if (data.winnerId != null && data.winnerId != 0) {
          this.editTournamentForm.controls['winnerId'].setValue(data.winnerId);
        }

        this.loading = false;
      },
      (err) => {
        alert('Une erreur est survenue lors de la récupération du tournoi.');
        console.error(err);
      },
    );
  }

  uploadProfilePicture(event: any) {
    if (event.target.files.length > 0) {
      this.currentFile = event.target.files[0];
    }
  }

  updateTournamentLogo() {
    if (this.currentFile != null) {
      this.loading = true;

      this.adminService
        .updateTournamentLogo(this.tournamentId, this.currentFile)
        .subscribe(
          (data) => {
            alert('Tournoi mis à jour !');
            this.loading = false;
            this.router.navigate(['/admin/fifa/tournaments']);
          },
          (err) => {
            alert('Erreur lors de la mise à jour du tournoi !');
            console.error(err);
            this.loading = false;
          },
        );
    } else {
      alert('Certaines informations sont manquantes !');
    }
  }

  editTournament() {
    if (
      this.editTournamentForm.controls['name'].value != null &&
      this.editTournamentForm.controls['name'].value != '' &&
      this.editTournamentForm.controls['state'].value != null &&
      this.editTournamentForm.controls['plannedFrom'].value != null &&
      this.editTournamentForm.controls['plannedFrom'].value != '' &&
      this.editTournamentForm.controls['plannedTo'].value != null &&
      this.editTournamentForm.controls['plannedTo'].value != ''
    ) {
      this.loading = true;

      let description: any = null;
      if (
        this.editTournamentForm.controls['description'].value != null &&
        this.editTournamentForm.controls['description'].value != ''
      ) {
        description = this.editTournamentForm.controls['description'].value;
      }

      let phase2ChallongeUrl: any = null;
      if (
        this.editTournamentForm.controls['phase2ChallongeUrl'].value != null &&
        this.editTournamentForm.controls['phase2ChallongeUrl'].value != ''
      ) {
        phase2ChallongeUrl =
          this.editTournamentForm.controls['phase2ChallongeUrl'].value;
      }

      var winnerId: number | undefined = 0;

      if (
        this.editTournamentForm.controls['winnerId'].value != null &&
        this.editTournamentForm.controls['winnerId'].value != 0
      ) {
        winnerId = this.editTournamentForm.controls['winnerId'].value;
      } else {
        winnerId = undefined;
      }

      var winPoints: number | undefined = 0;

      if (
        this.editTournamentForm.controls['winPoints'].value != null &&
        this.editTournamentForm.controls['winPoints'].value != 0
      ) {
        winPoints = this.editTournamentForm.controls['winPoints'].value;
      } else {
        winPoints = undefined;
      }

      var loosePoints: number | undefined = 0;

      if (
        this.editTournamentForm.controls['loosePoints'].value != null &&
        this.editTournamentForm.controls['loosePoints'].value != 0
      ) {
        loosePoints = this.editTournamentForm.controls['loosePoints'].value;
      } else {
        loosePoints = undefined;
      }

      var drawPoints: number | undefined = 0;

      if (
        this.editTournamentForm.controls['drawPoints'].value != null &&
        this.editTournamentForm.controls['drawPoints'].value != 0
      ) {
        drawPoints = this.editTournamentForm.controls['drawPoints'].value;
      } else {
        drawPoints = undefined;
      }

      let rules: any = null;
      if (
        this.editTournamentForm.controls['rules'].value != null &&
        this.editTournamentForm.controls['rules'].value != ''
      ) {
        rules = this.editTournamentForm.controls['rules'].value;
      }

      this.adminService
        .editTournament(
          this.tournamentId,
          this.editTournamentForm.controls['name'].value,
          this.editTournamentForm.controls['state'].value,
          this.editTournamentForm.controls['plannedFrom'].value,
          this.editTournamentForm.controls['plannedTo'].value,
          description,
          phase2ChallongeUrl,
          winnerId,
          winPoints,
          drawPoints,
          loosePoints,
          rules,
          this.editTournamentForm.controls['featured'].value ?? false,
        )
        .subscribe(
          (data) => {
            alert('Tournoi mis à jour !');
            this.loading = false;
            this.router.navigate(['/admin/fifa/tournaments']);
          },
          (err) => {
            alert('Erreur lors de la mise à jour du tournoi !');
            console.error(err);
            this.loading = false;
          },
        );
    } else {
      alert('Certaines informations sont manquantes !');
    }
  }

  deleteUser(userId: number) {
    if (
      confirm('Voulez-vous vraiment supprimer cet utilisateur du tournoi ?')
    ) {
      this.adminService
        .removeTournamentSubscription(this.tournamentId, userId)
        .subscribe(
          (data) => {
            alert('Utilisateur supprimé !');
            this.loading = false;
            this.router.navigate(['/admin/fifa/tournaments']);
          },
          (err) => {
            alert("Erreur lors de la suppression de l'utilisateur !");
            console.error(err);
            this.loading = false;
          },
        );
    }
  }
}
