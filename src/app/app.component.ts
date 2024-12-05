import { Component, HostBinding, OnInit, signal } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { KeycloakService } from 'keycloak-angular';
import { GameOnPlayerService } from './shared/services/gameon-player.service';
import { Store } from '@ngrx/store';
import { Player } from './shared/classes/Player';
import { setPlayer } from './store/actions/player.actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  darkMode = signal<boolean>(false);

  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }

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
        },
        (err) => {
          console.error('[AppComponent]', err);
        }
      );
    }
  }
}
