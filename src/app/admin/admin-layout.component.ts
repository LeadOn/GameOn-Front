import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { environment } from '../../environments/environment';
import {
  faCog,
  faComputer,
  faHome,
  faPlus,
  faSoccerBall,
  faTrophy,
  faUserCircle,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  userIcon = faUserCircle;
  homeIcon = faHome;
  ballIcon = faSoccerBall;
  plusIcon = faPlus;
  trophyIcon = faTrophy;
  adminIcon = faCog;
  isLoggedIn = false;
  isAdmin = false;
  platformIcon = faComputer;

  ngOnInit(): void {
    initFlowbite();
  }

  logout() {
    window.location.replace(
      environment.keycloak.url + 'realms/yufoot/protocol/openid-connect/logout'
    );
  }
}
