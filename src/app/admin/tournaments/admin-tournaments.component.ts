import { Component, OnInit } from '@angular/core';
import { Tournament } from '../../shared/classes/Tournament';
import { GameOnTournamentService } from '../../shared/services/gameon-tournament.service';
import { GameOnAdminService } from '../shared/services/gameon-admin.service';
import {
  faEdit,
  faSave,
  faTrash,
  faTrophy,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-tournaments',
  templateUrl: './admin-tournaments.component.html',
  styleUrls: ['./admin-tournaments.component.scss'],
})
export class AdminTournamentsComponent implements OnInit {
  tournaments: Tournament[] = [];
  tournamentIcon = faTrophy;
  states: any[] = [];
  loading = true;
  editIcon = faEdit;
  saveIcon = faSave;
  trashIcon = faTrash;

  constructor(
    private tournamentService: GameOnTournamentService,
    private adminService: GameOnAdminService
  ) {
    this.states = this.tournamentService.getStates();
  }

  ngOnInit(): void {
    this.tournamentService.getAll().subscribe(
      (data) => {
        this.tournaments = data;
        this.loading = false;
      },
      (err) => {
        alert('Une erreur est survenue lors de la récupération des tournois.');
        console.error(err);
        this.loading = false;
      }
    );
  }

  getState(stateId: number): string {
    let label = 'Inconnu';
    this.states.forEach((x) => {
      if (x.value == stateId) {
        label = x.label;
      }
    });

    return label;
  }

  goToPhase1(id: number) {
    if (
      confirm(
        'Voulez-vous passer ce tournoi en phase 1 ? Cette action va générer les matchs concernés !'
      )
    ) {
      this.adminService.goToPhase1(id).subscribe(
        (data) => {
          window.location.reload();
        },
        (err) => {
          console.error(err);
          alert('Une erreur est survenue lors du passage en phase 1.');
        }
      );
    }
  }

  savePhase1Score(id: number) {
    if (confirm('Voulez-vous sauvegarder le score de la phase 1 ?')) {
      this.adminService.savePhase1Score(id).subscribe(
        (data) => {
          window.location.reload();
        },
        (err) => {
          console.error(err);
          alert(
            'Une erreur est survenue lors de la sauvegarde du score de la phase 1.'
          );
        }
      );
    }
  }

  delete(id: number) {
    if (
      confirm(
        'Êtes-vous sûr de bien vouloir supprimer le tournoi ' +
          id +
          ' ? ATTENTION : Cette action est irrévesible !'
      )
    ) {
      this.adminService.deleteTournament(id).subscribe(
        (data) => {
          window.location.reload();
        },
        (err) => {
          console.error(err);
          alert('Une erreur est survenue lors de la suppresion du tournoi.');
        }
      );
    }
  }
}
