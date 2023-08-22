import { Component, OnInit } from "@angular/core";
import { faExternalLinkAlt } from "@fortawesome/free-solid-svg-icons";
import { KeycloakService } from "keycloak-angular";
import { FifaGamePlayed } from "src/app/shared/classes/FifaGamePlayed";
import { YuGamesGameService } from "src/app/shared/services/yugames-game.service";

@Component({
  selector: "app-fifa-history",
  templateUrl: "./fifa-history.component.html",
  styleUrls: ["./fifa-history.component.scss"],
})
export class FifaHistoryComponent implements OnInit {
  loading = true;
  games: FifaGamePlayed[] = [];
  isLoggedIn = false;

  externalIcon = faExternalLinkAlt;

  constructor(
    private gameService: YuGamesGameService,
    private keycloak: KeycloakService
  ) {}

  ngOnInit(): void {
    this.keycloak.isLoggedIn().then((x) => (this.isLoggedIn = x));
    this.loading = true;
    this.gameService.getLast(20).subscribe(
      (data) => {
        this.games = data;
        this.loading = false;
      },
      (err) => {
        console.error("[FifaHistory]", err);
        alert(
          "Une erreur est survenue lors de la récupération des matchs joués."
        );
      }
    );
  }
}
