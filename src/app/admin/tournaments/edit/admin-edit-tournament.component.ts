import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { GameOnAdminService } from '../../shared/services/gameon-admin.service';
import { GameOnTournamentService } from '../../../shared/services/gameon-tournament.service';
import { Tournament } from '../../../shared/classes/Tournament';

@Component({
  selector: 'app-admin-edit-tournament-edit',
  templateUrl: './admin-edit-tournament.component.html',
  styleUrls: ['./admin-edit-tournament.component.scss'],
})
export class AdminEditTournamentComponent implements OnInit {
  loading = true;
  tournamentId: any;
  tournament?: Tournament;
  states: any[] = [];

  editTournamentForm = new FormGroup({
    name: new FormControl('', [Validators.maxLength(100), Validators.required]),
    description: new FormControl('', [Validators.maxLength(5000)]),
    state: new FormControl(0, [Validators.required]),
    logoUrl: new FormControl('', [Validators.maxLength(3000)]),
    phase2ChallongeUrl: new FormControl('', [Validators.maxLength(3000)]),
    plannedFrom: new FormControl('', [Validators.required]),
    plannedTo: new FormControl('', [Validators.required]),
    winnerId: new FormControl(0),
  });

  constructor(
    private adminService: GameOnAdminService,
    private tournamentService: GameOnTournamentService,
    private router: Router,
    private route: ActivatedRoute
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
          data.plannedFrom.toString()
        );
        this.editTournamentForm.controls['plannedTo'].setValue(
          data.plannedTo.toString()
        );

        if (data.description != null) {
          this.editTournamentForm.controls['description'].setValue(
            data.description
          );
        }

        if (data.logoUrl != null) {
          this.editTournamentForm.controls['logoUrl'].setValue(data.logoUrl);
        }

        if (data.phase2ChallongeUrl != null) {
          this.editTournamentForm.controls['phase2ChallongeUrl'].setValue(
            data.phase2ChallongeUrl
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
      }
    );
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

      let logoUrl: any = null;
      if (
        this.editTournamentForm.controls['logoUrl'].value != null &&
        this.editTournamentForm.controls['logoUrl'].value != ''
      ) {
        logoUrl = this.editTournamentForm.controls['logoUrl'].value;
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

      this.adminService
        .editTournament(
          this.tournamentId,
          this.editTournamentForm.controls['name'].value,
          this.editTournamentForm.controls['state'].value,
          this.editTournamentForm.controls['plannedFrom'].value,
          this.editTournamentForm.controls['plannedTo'].value,
          description,
          logoUrl,
          phase2ChallongeUrl,
          winnerId
        )
        .subscribe(
          (data) => {
            alert('Tournoi mis à jour !');
            this.loading = false;
            this.router.navigate(['/admin/tournaments']);
          },
          (err) => {
            alert('Erreur lors de la mise à jour du tournoi !');
            console.error(err);
            this.loading = false;
          }
        );
    } else {
      alert('Certaines informations sont manquantes !');
    }
  }
}
