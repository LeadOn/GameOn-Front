import { Component, OnInit } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { YuFootApiService } from "../services/yufoot-api.service";
import { Player } from "../classes/Player";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  isLoggedIn = false;
  player: Player = new Player();

  constructor(
    private keycloak: KeycloakService,
    private yufootApi: YuFootApiService
  ) {
    this.keycloak.isLoggedIn().then((x) => (this.isLoggedIn = x));
  }

  ngOnInit(): void {
    if (this.isLoggedIn == true) {
      this.yufootApi.getCurrentUser().subscribe((data) => {
        this.player = data;
      });
    }
  }
}
