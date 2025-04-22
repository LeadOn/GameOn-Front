import { Component, HostBinding, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  faBitcoinSign,
  faCog,
  faHome,
  faMoon,
  faPlus,
  faSoccerBall,
  faSun,
  faTrophy,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Player } from '../classes/common/Player';
import Keycloak from 'keycloak-js';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.css'],
  standalone: false,
})
export class CommonLayoutComponent {
  private readonly keycloak = inject(Keycloak);

  player$: Observable<Player>;

  lightIcon = faSun;
  darkIcon = faMoon;

  isLoggedIn = false;
  isAdmin = false;
  userIcon = faUserCircle;
  homeIcon = faHome;
  ballIcon = faSoccerBall;
  plusIcon = faPlus;
  trophyIcon = faTrophy;
  adminIcon = faCog;
  btcIcon = faBitcoinSign;

  darkMode = signal<boolean>(
    JSON.parse(window.localStorage.getItem('gameon-dark-theme') ?? 'false'),
  );

  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }
  constructor(
    private router: Router,
    private store: Store<{ player: Player }>,
  ) {
    this.player$ = store.select('player');

    this.isLoggedIn =
      this.keycloak.authenticated != null && this.keycloak.authenticated
        ? true
        : false;
    this.isAdmin = this.keycloak.hasRealmRole('gameon_admin');
  }

  login() {
    this.keycloak.login();
  }

  createMatch() {
    if (this.isLoggedIn == false) {
      this.login();
    } else {
      this.router.navigate(['/fifa/create']);
    }
  }

  toggleDarkMode() {
    this.darkMode.update((prev) => !prev);
    window.localStorage.setItem(
      'gameon-dark-theme',
      JSON.stringify(this.darkMode()),
    );
  }
}
