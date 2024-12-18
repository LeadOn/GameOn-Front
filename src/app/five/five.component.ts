import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { SoccerFive } from '../shared/classes/SoccerFive';
import { GameOnSoccerfiveService } from '../shared/services/gameon-soccerfive.service';
import { KeycloakService } from 'keycloak-angular';
import {
  faFootballBall,
  faInfoCircle,
  faSoccerBall,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-five',
  templateUrl: './five.component.html',
  styleUrl: './five.component.scss',
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
