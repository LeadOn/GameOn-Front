import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faCog,
  faHome,
  faPlus,
  faSoccerBall,
  faTrophy,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';
import { initFlowbite } from 'flowbite';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss'],
})
export class CommonLayoutComponent implements OnInit {
  isLoggedIn = false;
  isAdmin = false;
  userIcon = faUserCircle;
  homeIcon = faHome;
  ballIcon = faSoccerBall;
  plusIcon = faPlus;
  trophyIcon = faTrophy;
  adminIcon = faCog;

  constructor(private keycloak: KeycloakService, private router: Router) {
    this.isLoggedIn = this.keycloak.isLoggedIn();
    this.isAdmin = this.keycloak.isUserInRole('gameon_admin');
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
