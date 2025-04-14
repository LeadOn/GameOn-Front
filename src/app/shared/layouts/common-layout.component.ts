import { Component, inject, OnInit } from '@angular/core';
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
export class CommonLayoutComponent implements OnInit {
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

  darkMode = false;

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

  ngOnInit(): void {
    this.darkMode =
      window.localStorage.getItem('gameon-dark-theme') == 'true' ? true : false;

    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    }
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
    this.darkMode = !this.darkMode;
    window.localStorage.setItem('gameon-dark-theme', this.darkMode.toString());

    if (this.darkMode == false) {
      document.documentElement.classList.remove('dark');
    } else {
      document.documentElement.classList.add('dark');
    }
  }
}
