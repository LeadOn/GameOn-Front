import { Component, OnInit } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { Player } from "../shared/classes/Player";
import { environment } from "src/environments/environment";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";

@Component({
  selector: "app-home",
  templateUrl: "./home.component.html",
  styleUrls: ["./home.component.scss"],
})
export class HomeComponent implements OnInit {
  player$: Observable<Player>;

  isLoggedIn = false;
  isAdmin = false;
  isProduction = false;
  externalIcon = faExternalLinkAlt;
  token = "";

  constructor(
    private keycloak: KeycloakService,
    private store: Store<{ player: Player }>
  ) {
    this.isProduction = environment.production;
    this.player$ = store.select("player");
  }

  ngOnInit(): void {
    this.keycloak.isLoggedIn().then((x) => {
      this.isLoggedIn = x;

      if (this.isLoggedIn == true) {
        this.isAdmin = this.keycloak.isUserInRole("yugames_admin");
      }

      if (environment.production == false && this.isLoggedIn == true) {
        this.keycloak.getToken().then((x) => {
          this.token = x;
        });
      }
    });
  }
}
