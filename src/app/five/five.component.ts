import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { SoccerFive } from '../shared/classes/SoccerFive';
import { GameOnSoccerfiveService } from '../shared/services/gameon-soccerfive.service';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-five',
  templateUrl: './five.component.html',
  styleUrl: './five.component.scss',
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
})
export class FiveComponent implements OnInit {
  loading = false;
  fives: SoccerFive[] = [];
  isLoggedIn = true;

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
}
