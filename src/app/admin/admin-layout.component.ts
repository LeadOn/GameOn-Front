import { Component, effect, HostBinding, OnInit, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import {
  faClock,
  faCog,
  faComputer,
  faHome,
  faMoon,
  faPlus,
  faRightFromBracket,
  faSoccerBall,
  faSun,
  faTrophy,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.css'],
  animations: [
    trigger('inOutAnimation', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 })),
      ]),
      transition(':leave', [
        style({ opacity: 1 }),
        animate(200, style({ opacity: 0 })),
      ]),
    ]),
  ],
  standalone: false,
})
export class AdminLayoutComponent {
  userIcon = faUserCircle;
  homeIcon = faHome;
  ballIcon = faSoccerBall;
  plusIcon = faPlus;
  trophyIcon = faTrophy;
  adminIcon = faCog;
  isLoggedIn = false;
  isAdmin = false;
  platformIcon = faComputer;
  changelogIcon = faClock;

  logoutIcon = faRightFromBracket;
  generalIcon = faCog;

  lightIcon = faSun;
  darkIcon = faMoon;

  darkMode = signal<boolean>(
    JSON.parse(window.localStorage.getItem('gameon-dark-theme') ?? 'false'),
  );

  @HostBinding('class.dark') get mode() {
    return this.darkMode();
  }

  constructor() {
    effect(() => {
      window.localStorage.setItem(
        'gameon-dark-theme',
        JSON.stringify(this.darkMode()),
      );
    });
  }

  logout() {
    window.location.replace(
      environment.keycloak.url +
        '/realms/gameon/protocol/openid-connect/logout',
    );
  }

  toggleDarkMode() {
    this.darkMode.update((prev) => !prev);
    window.localStorage.setItem(
      'gameon-dark-theme',
      JSON.stringify(this.darkMode()),
    );
  }
}
