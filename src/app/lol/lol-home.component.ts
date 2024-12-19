import { Component, OnInit } from '@angular/core';
import { GameOnPlayerService } from '../shared/services/gameon-player.service';
import { KeycloakService } from 'keycloak-angular';
import { PlayerDto } from '../shared/classes/PlayerDto';

@Component({
  selector: 'app-lol-home',
  templateUrl: './lol-home.component.html',
  styleUrl: './lol-home.component.scss',
})
export class LolHomeComponent implements OnInit {
  leaguePlayers: PlayerDto[] = [];
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
        console.log(this.leaguePlayers);
      },
      (err) => {
        console.error(err);
      }
    );
  }
}
