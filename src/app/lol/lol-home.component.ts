import { Component, OnInit } from '@angular/core';
import { GameOnPlayerService } from '../shared/services/gameon-player.service';
import { KeycloakService } from 'keycloak-angular';
import { PlayerDto } from '../shared/classes/PlayerDto';
import { Observable } from 'rxjs';
import { Player } from '../shared/classes/Player';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-lol-home',
  templateUrl: './lol-home.component.html',
  styleUrl: './lol-home.component.scss',
})
export class LolHomeComponent implements OnInit {
  leaguePlayers: PlayerDto[] = [];
  isLoading = true;
  isLoggedIn = false;
  player$: Observable<Player>;

  constructor(
    private playerService: GameOnPlayerService,
    private keycloakService: KeycloakService,
    private store: Store<{ player: Player }>
  ) {
    this.player$ = store.select('player');

    this.isLoggedIn = keycloakService.isLoggedIn();
  }

  login() {
    this.keycloakService.login();
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
