import { Component, OnInit } from '@angular/core';
import { KeycloakService } from 'keycloak-angular';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { GameOnLoLService } from '../shared/services/leagueoflegends/gameon-lol.service';
import { Player } from '../shared/classes/common/Player';
import { PlayerDto } from '../shared/classes/common/PlayerDto';

@Component({
  selector: 'app-lol-home',
  templateUrl: './lol-home.component.html',
  styleUrl: './lol-home.component.scss',
  standalone: false,
})
export class LolHomeComponent implements OnInit {
  leaguePlayers: PlayerDto[] = [];
  isLoading = true;
  isLoggedIn = false;
  player$: Observable<Player>;

  constructor(
    private lolService: GameOnLoLService,
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
    this.lolService.getAll().subscribe(
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
