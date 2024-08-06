import { Component, OnInit } from '@angular/core';
import { initFlowbite } from 'flowbite';
import { environment } from '../../environments/environment';

@Component({
  selector: 'app-admin-layout',
  templateUrl: './admin-layout.component.html',
  styleUrls: ['./admin-layout.component.scss'],
})
export class AdminLayoutComponent implements OnInit {
  ngOnInit(): void {
    initFlowbite();
  }

  logout() {
    window.location.replace(
      environment.keycloak.url + 'realms/yufoot/protocol/openid-connect/logout'
    );
  }
}
