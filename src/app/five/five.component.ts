import { Component, inject, OnInit } from '@angular/core';
import { faInfoCircle, faSoccerBall } from '@fortawesome/free-solid-svg-icons';
import { GameOnSoccerfiveService } from '../shared/services/fifa/gameon-soccerfive.service';
import { SoccerFive } from '../shared/classes/fifa/SoccerFive';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-five',
  templateUrl: './five.component.html',
  styleUrl: './five.component.scss',
  standalone: false,
})
export class FiveComponent implements OnInit {
  private readonly keycloak = inject(Keycloak);

  loading = false;
  fives: SoccerFive[] = [];
  isLoggedIn = true;
  footballIcon = faSoccerBall;
  infoIcon = faInfoCircle;

  constructor(private fiveService: GameOnSoccerfiveService) {}

  ngOnInit(): void {
    this.loading = true;

    this.isLoggedIn =
      this.keycloak.authenticated != null && this.keycloak.authenticated
        ? true
        : false;

    this.fiveService.getAll().subscribe(
      (data) => {
        this.fives = data;
        this.loading = false;
      },
      (err) => {
        alert(
          'Une erreur est survenue lors de la récupération des parties de Soccerfive.'
        );
        console.error(err);
      }
    );
  }

  getState(stateId: number): string {
    let label = 'Inconnu';
    this.fiveService.getStates().forEach((x) => {
      if (x.value == stateId) {
        label = x.label;
      }
    });

    return label;
  }

  login() {
    this.keycloak.login();
  }
}
