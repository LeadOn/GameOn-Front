import { Component, OnInit } from '@angular/core';
import { faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Tournament } from '../../../shared/classes/fifa/Tournament';
import { GameOnTournamentService } from '../../../shared/services/fifa/gameon-tournament.service';

@Component({
  selector: 'app-tournaments-home',
  templateUrl: './tournaments-home.component.html',
  styleUrls: ['./tournaments-home.component.css'],
  standalone: false,
})
export class TournamentsHomeComponent implements OnInit {
  loading = true;
  states: any[] = [];
  tournaments: Tournament[] = [];
  trophyIcon = faTrophy;

  constructor(private tournamentService: GameOnTournamentService) {
    this.states = tournamentService.getStates();
  }

  ngOnInit(): void {
    this.tournamentService.getAll().subscribe(
      (data) => {
        this.tournaments = data;
        this.loading = false;
      },
      (err) => {
        alert('Erreur lors de la récupération des tournois.');
        console.error(err);
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
}
