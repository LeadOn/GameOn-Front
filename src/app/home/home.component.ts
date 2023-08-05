import { Component, OnInit } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { YuFootApiService } from "../services/yufoot-api.service";
import { Player } from "../classes/Player";
import { environment } from "src/environments/environment";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  player: Player = new Player();
  token = "";
  isProduction = false;
  externalIcon = faExternalLinkAlt;

  constructor(
    private keycloak: KeycloakService,
    private yufootApi: YuFootApiService
  ) {
    this.isProduction = environment.production;
    this.keycloak.isLoggedIn().then((x) => (this.isLoggedIn = x));
  }

  ngOnInit(): void {
    if (this.isLoggedIn == true) {
      this.yufootApi.getCurrentUser().subscribe((data) => {
        this.player = data;
      });
    }

    if (environment.production == false && this.isLoggedIn == true) {
      this.keycloak.getToken().then((x) => (this.token = x));
    }
  }
}
