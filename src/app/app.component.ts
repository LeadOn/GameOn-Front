import { Component, inject, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Player } from './shared/classes/common/Player';
import { GameOnPlayerService } from './shared/services/common/gameon-player.service';
import Keycloak from 'keycloak-js';
import { setPlayer, setPlayerStats } from './core/store/actions/player.actions';
import { RiotLoLService } from './shared/services/leagueoflegends/riot-lol.service';
import { setLoLVersion } from './core/store/actions/lol.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  standalone: false,
})
export class AppComponent implements OnInit {
  private readonly keycloak = inject(Keycloak);

  isLoggedIn = false;

  constructor(
    private playerService: GameOnPlayerService,
    private riotLoLService: RiotLoLService,
    private store: Store<{ player: Player; lolVersion: string }>,
  ) {}

  ngOnInit(): void {
    this.isLoggedIn =
      this.keycloak.authenticated != null && this.keycloak.authenticated
        ? true
        : false;

    if (this.isLoggedIn) {
      // Getting its account, and setting it into store
      this.playerService.getCurrent().subscribe(
        (data) => {
          this.store.dispatch(setPlayer({ player: data }));

          this.playerService.getStats(data.id).subscribe(
            (data) => {
              this.store.dispatch(
                setPlayerStats({ globalStats: data.statsPerPlatform[0] }),
              );
            },
            (err) => {
              console.error('[AppComponent]', err);
            },
          );
        },
        (err) => {
          console.error('[AppComponent]', err);
        },
      );
    }

    this.riotLoLService.getPatchs().subscribe((data) => {
      this.store.dispatch(setLoLVersion({ version: data[0] }));
      console.log('[AppComponent] LoL version set to ' + data[0]);
    });
  }
}
