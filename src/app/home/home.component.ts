import { Component, OnInit } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { Player } from "../shared/classes/Player";
import { environment } from "src/environments/environment";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { YuFootPlayerService } from "../shared/services/yufoot-player.service";

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
  isAdmin = false;

  constructor(
    private keycloak: KeycloakService,
    private playerService: YuFootPlayerService
  ) {
    this.isProduction = environment.production;
    this.keycloak.isLoggedIn().then((x) => (this.isLoggedIn = x));
  }

  ngOnInit(): void {
    if (this.isLoggedIn == true) {
      this.playerService.getCurrent().subscribe((data) => {
        this.player = data;
      });

      this.isAdmin = this.keycloak.isUserInRole("yugames_admin");
    }

    if (environment.production == false && this.isLoggedIn == true) {
      this.keycloak.getToken().then((x) => (this.token = x));
    }
  }
}
