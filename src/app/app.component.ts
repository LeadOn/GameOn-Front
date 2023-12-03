import { Component, OnInit } from "@angular/core";
import { initFlowbite } from "flowbite";
import { KeycloakService } from "keycloak-angular";
import { YuGamesPlayerService } from "./shared/services/yugames-player.service";
import { Store } from "@ngrx/store";
import { Player } from "./shared/classes/Player";
import { setPlayer } from "./store/actions/player.actions";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.scss"],
})
export class AppComponent implements OnInit {
  constructor(
    private keycloak: KeycloakService,
    private playerService: YuGamesPlayerService,
    private store: Store<{ player: Player }>
  ) {}

  ngOnInit(): void {
    initFlowbite();

    if (this.keycloak.isLoggedIn()) {
      // Getting its account, and setting it into store
      this.playerService.getCurrent().subscribe(
        (data) => {
          this.store.dispatch(setPlayer({ player: data }));
          console.log("[AppComponent]", "Player stored.");
        },
        (err) => {
          console.error("[AppComponent]", err);
        }
      );
    }
  }
}
