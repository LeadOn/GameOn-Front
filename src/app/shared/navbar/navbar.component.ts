import { Component, OnInit } from "@angular/core";
import {
  faUser,
  faXmarkCircle,
  faPlusSquare,
} from "@fortawesome/free-regular-svg-icons";
import { KeycloakService } from "keycloak-angular";
import { environment } from "src/environments/environment";

@Component({
  selector: "app-navbar",
  templateUrl: "./navbar.component.html",
  styleUrls: ["./navbar.component.scss"],
})
export class NavbarComponent implements OnInit {
  isLoggedIn = false;
  userIcon = faUser;
  logoutIcon = faXmarkCircle;
  createMatch = faPlusSquare;

  constructor(private keycloak: KeycloakService) {
    this.keycloak.isLoggedIn().then((x) => (this.isLoggedIn = x));
  }

  ngOnInit(): void {}

  login() {
    this.keycloak.login();
  }

  logout() {
    window.location.replace(
      environment.keycloak.url + "realms/yufoot/protocol/openid-connect/logout"
    );
  }
}
