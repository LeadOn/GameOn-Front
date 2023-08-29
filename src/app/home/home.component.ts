import { Component, OnInit } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { Player } from "../shared/classes/Player";
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
  externalIcon = faExternalLinkAlt;

  constructor(
    private keycloak: KeycloakService,
    private store: Store<{ player: Player }>
  ) {
    this.player$ = store.select("player");
  }

  ngOnInit(): void {
    this.keycloak.isLoggedIn().then((x) => {
      this.isLoggedIn = x;

      if (this.isLoggedIn == true) {
        this.isAdmin = this.keycloak.isUserInRole("yugames_admin");
      }
    });
  }
}
