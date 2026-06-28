import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  faEdit,
  faPlus,
  faSave,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { Tournament } from '../../../shared/classes/fifa/Tournament';
import { GameOnTournamentService } from '../../../shared/services/fifa/gameon-tournament.service';
import { GameOnAdminService } from '../../shared/services/gameon-admin.service';

@Component({
  selector: 'app-admin-tournaments',
  templateUrl: './admin-tournaments.component.html',
  styleUrls: ['./admin-tournaments.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class AdminTournamentsComponent implements OnInit {
  tournaments: Tournament[] = [];
  states: any[] = [];
  loading = true;
  editIcon = faEdit;
  saveIcon = faSave;
  trashIcon = faTrash;
  plusIcon = faPlus;

  constructor(
    private tournamentService: GameOnTournamentService,
    private adminService: GameOnAdminService,
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
      },
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

  stateClasses(stateId: number): string {
    switch (stateId) {
      case 1:
        return 'bg-secondary/15 text-secondary';
      case 2:
        return 'bg-customYellow/15 text-customYellow';
      case 3:
        return 'bg-customGreen/15 text-customGreen';
      default:
        return 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-300';
    }
  }

  goToPhase1(id: number) {
    if (
      confirm(
        'Voulez-vous passer ce tournoi en phase 1 ? Cette action va générer les matchs concernés !',
      )
    ) {
      this.adminService.goToPhase1(id).subscribe(
        (data) => {
          window.location.reload();
        },
        (err) => {
          console.error(err);
          alert('Une erreur est survenue lors du passage en phase 1.');
        },
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
            'Une erreur est survenue lors de la sauvegarde du score de la phase 1.',
          );
        },
      );
    }
  }

  delete(id: number) {
    if (
      confirm(
        'Êtes-vous sûr de bien vouloir supprimer le tournoi ' +
          id +
          ' ? ATTENTION : Cette action est irrévesible !',
      )
    ) {
      this.adminService.deleteTournament(id).subscribe(
        (data) => {
          window.location.reload();
        },
        (err) => {
          console.error(err);
          alert('Une erreur est survenue lors de la suppresion du tournoi.');
        },
      );
    }
  }
}
