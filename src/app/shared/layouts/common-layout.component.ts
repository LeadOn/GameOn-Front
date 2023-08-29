import { Component, OnInit } from "@angular/core";
import {
  faPlusSquare,
  faUser,
  faXmarkCircle,
} from "@fortawesome/free-solid-svg-icons";
import { initFlowbite } from "flowbite";
import { KeycloakService } from "keycloak-angular";

@Component({
  selector: "app-common-layout",
  templateUrl: "./common-layout.component.html",
  styleUrls: ["./common-layout.component.scss"],
})
export class CommonLayoutComponent implements OnInit {
  isLoggedIn = false;
  userIcon = faUser;
  logoutIcon = faXmarkCircle;
  createMatch = faPlusSquare;

  constructor(private keycloak: KeycloakService) {
    this.keycloak.isLoggedIn().then((x) => (this.isLoggedIn = x));
  }

  ngOnInit(): void {
    initFlowbite();
  }

  login() {
    this.keycloak.login();
  }
}
