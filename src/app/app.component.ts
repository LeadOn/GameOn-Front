import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { KeycloakService } from 'keycloak-angular';
import { Store } from '@ngrx/store';
import { setPlayer, setPlayerStats } from './store/actions/player.actions';
import { Player } from './shared/classes/common/Player';
import { GameOnPlayerService } from './shared/services/common/gameon-player.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
  standalone: false,
})
export class AppComponent implements OnInit {
  constructor(
    private keycloak: KeycloakService,
    private playerService: GameOnPlayerService,
    private store: Store<{ player: Player }>
  ) {}

  ngOnInit(): void {
    initFlowbite();

    if (this.keycloak.isLoggedIn()) {
      // Getting its account, and setting it into store
      this.playerService.getCurrent().subscribe(
        (data) => {
          this.store.dispatch(setPlayer({ player: data }));

          this.playerService.getStats(data.id).subscribe(
            (data) => {
              this.store.dispatch(
                setPlayerStats({ globalStats: data.statsPerPlatform[0] })
              );
            },
            (err) => {
              console.error('[AppComponent]', err);
            }
          );
        },
        (err) => {
          console.error('[AppComponent]', err);
        }
      );
    }
  }
}
