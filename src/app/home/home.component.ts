import { Component, OnInit } from "@angular/core";
import { KeycloakService } from "keycloak-angular";
import { Player } from "../shared/classes/Player";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { Observable } from "rxjs";
import { Store } from "@ngrx/store";
import { Season } from "../shared/classes/Season";
import { YuGamesSeasonService } from "../shared/services/yugames-season.service";

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

  currentSeason?: Season;

  constructor(
    private keycloak: KeycloakService,
    private store: Store<{ player: Player }>,
    private seasonService: YuGamesSeasonService
  ) {
    this.player$ = store.select("player");
  }

  ngOnInit(): void {
    this.seasonService.getCurrent().subscribe(
      (x) => {
        this.currentSeason = x;
      },
      (err) => {
        console.error(err);
        alert("Erreur lors de la récupération de la saison en cours.");
      }
    );

    this.keycloak.isLoggedIn().then((x) => {
      this.isLoggedIn = x;

      if (this.isLoggedIn == true) {
        this.isAdmin = this.keycloak.isUserInRole("yugames_admin");
      }
    });
  }
}
