import { Component, effect, HostBinding, OnInit, signal } from '@angular/core';
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
import { initFlowbite } from 'flowbite';
import { KeycloakService } from 'keycloak-angular';
import { Player } from '../classes/Player';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-common-layout',
    templateUrl: './common-layout.component.html',
    styleUrls: ['./common-layout.component.scss'],
    standalone: false
})
export class CommonLayoutComponent implements OnInit {
  darkMode = signal<boolean>(
    JSON.parse(window.localStorage.getItem('gameon-dark-theme') ?? 'false')
  );

  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }

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

  constructor(
    private keycloak: KeycloakService,
    private router: Router,
    private store: Store<{ player: Player }>
  ) {
    this.player$ = store.select('player');

    this.isLoggedIn = this.keycloak.isLoggedIn();
    this.isAdmin = this.keycloak.isUserInRole('gameon_admin');

    effect(() => {
      window.localStorage.setItem(
        'gameon-dark-theme',
        JSON.stringify(this.darkMode())
      );
    });
  }

  ngOnInit(): void {
    initFlowbite();
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
}
