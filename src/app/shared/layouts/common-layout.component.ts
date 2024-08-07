import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { KeycloakService } from 'keycloak-angular';

@Component({
  selector: 'app-common-layout',
  templateUrl: './common-layout.component.html',
  styleUrls: ['./common-layout.component.scss'],
})
export class CommonLayoutComponent implements OnInit {
  isLoggedIn = false;

  constructor(private keycloak: KeycloakService) {
    this.isLoggedIn = this.keycloak.isLoggedIn();
  }

  ngOnInit(): void {
    initFlowbite();
  }

  login() {
    this.keycloak.login();
  }
}
