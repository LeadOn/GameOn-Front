import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { GameOnAdminService } from '../../../shared/services/gameon-admin.service';
import { GameOnTournamentService } from '../../../../shared/services/fifa/gameon-tournament.service';

@Component({
  selector: 'app-admin-create-tournament-edit',
  templateUrl: './admin-create-tournament.component.html',
  styleUrls: ['./admin-create-tournament.component.css'],
  standalone: false,
})
export class AdminCreateTournamentComponent implements OnInit {
  loading = false;
  states: any[] = [];

  createTournamentForm = new FormGroup({
    name: new FormControl('', [Validators.maxLength(100), Validators.required]),
    description: new FormControl('', [Validators.maxLength(5000)]),
    state: new FormControl(0, [Validators.required]),
    plannedFrom: new FormControl('', [Validators.required]),
    plannedTo: new FormControl('', [Validators.required]),
  });

  constructor(
    private adminService: GameOnAdminService,
    private tournamentService: GameOnTournamentService,
    private router: Router,
  ) {
    this.states = this.tournamentService.getStates();
  }

  ngOnInit(): void {}

  createTournament() {
    if (
      this.createTournamentForm.controls['name'].value != null &&
      this.createTournamentForm.controls['name'].value != '' &&
      this.createTournamentForm.controls['state'].value != null &&
      this.createTournamentForm.controls['plannedFrom'].value != null &&
      this.createTournamentForm.controls['plannedFrom'].value != '' &&
      this.createTournamentForm.controls['plannedTo'].value != null &&
      this.createTournamentForm.controls['plannedTo'].value != ''
    ) {
      this.loading = true;

      let description: any = null;
      if (
        this.createTournamentForm.controls['description'].value != null &&
        this.createTournamentForm.controls['description'].value != ''
      ) {
        description = this.createTournamentForm.controls['description'].value;
      }

      this.adminService
        .createTournament(
          this.createTournamentForm.controls['name'].value,
          this.createTournamentForm.controls['state'].value,
          this.createTournamentForm.controls['plannedFrom'].value,
          this.createTournamentForm.controls['plannedTo'].value,
          description,
        )
        .subscribe(
          (data) => {
            alert('Tournoi créé !');
            this.loading = false;
            this.router.navigate(['/admin/fifa/tournaments']);
          },
          (err) => {
            alert('Erreur lors de la création du tournoi !');
            console.error(err);
            this.loading = false;
          },
        );
    } else {
      alert('Certaines informations sont manquantes !');
    }
  }
}
