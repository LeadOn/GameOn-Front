import { Component, OnInit } from '@angular/core';
import { GameOnPlayerService } from '../shared/services/gameon-player.service';
import { Player } from '../shared/classes/Player';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-lol-home',
  templateUrl: './lol-home.component.html',
  styleUrl: './lol-home.component.scss',
})
export class LolHomeComponent implements OnInit {
  leaguePlayers: Player[] = [];
  isLoading = true;
  isLoggedIn = false;

  constructor(
    private playerService: GameOnPlayerService,
    private keycloakService: KeycloakService
  ) {
    this.isLoggedIn = keycloakService.isLoggedIn();
  }

  ngOnInit() {
    this.playerService.getAllLol().subscribe(
      (players) => {
        this.leaguePlayers = players;
        this.isLoading = false;
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
