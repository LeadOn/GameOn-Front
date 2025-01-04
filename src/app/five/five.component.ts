import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { faInfoCircle, faSoccerBall } from '@fortawesome/free-solid-svg-icons';
import { GameOnSoccerfiveService } from '../shared/services/fifa/gameon-soccerfive.service';
import { SoccerFive } from '../shared/classes/fifa/SoccerFive';

@Component({
  selector: 'app-five',
  templateUrl: './five.component.html',
  styleUrl: './five.component.scss',
  standalone: false,
})
export class FiveComponent implements OnInit {
  loading = false;
  fives: SoccerFive[] = [];
  isLoggedIn = true;
  footballIcon = faSoccerBall;
  infoIcon = faInfoCircle;

  constructor(
    private fiveService: GameOnSoccerfiveService,
    private keycloakService: KeycloakService
  ) {}

  ngOnInit(): void {
    this.loading = true;

    this.isLoggedIn = this.keycloakService.isLoggedIn();

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
    this.keycloakService.login();
  }
}
