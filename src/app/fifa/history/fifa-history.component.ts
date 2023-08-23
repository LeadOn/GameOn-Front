import { Component, OnInit } from "@angular/core";
import { faExternalLinkAlt, faFilter } from "@fortawesome/free-solid-svg-icons";
import { KeycloakService } from "keycloak-angular";
import { FifaGamePlayed } from "src/app/shared/classes/FifaGamePlayed";
import { Platform } from "src/app/shared/classes/Platform";
import { YuGamesGameService } from "src/app/shared/services/yugames-game.service";
import { YuGamesPlatformService } from "src/app/shared/services/yugames-platform.service";

@Component({
  selector: "app-fifa-history",
  templateUrl: "./fifa-history.component.html",
  styleUrls: ["./fifa-history.component.scss"],
})
export class FifaHistoryComponent implements OnInit {
  loading = true;
  games: FifaGamePlayed[] = [];
  platforms: Platform[] = [];
  platformId = 0;
  isLoggedIn = false;
  numberOfGames = 10;
  startDate = undefined;
  endDate = undefined;

  externalIcon = faExternalLinkAlt;
  filterIcon = faFilter;

  constructor(
    private gameService: YuGamesGameService,
    private platformService: YuGamesPlatformService,
    private keycloak: KeycloakService
  ) {}

  ngOnInit(): void {
    this.keycloak.isLoggedIn().then((x) => (this.isLoggedIn = x));
    this.loading = true;
    this.getPlatforms();
    this.getGames();
  }

  getPlatforms() {
    this.platformService.getAll().subscribe(
      (data) => {
        this.platforms = data;
      },
      (err) => {
        alert("Erreur lors de la récupération des plateformes.");
        console.error(err);
      }
    );
  }

  getGames() {
    this.games.length = 0;
    this.loading = true;
    this.gameService.getLast(this.numberOfGames).subscribe(
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

  searchGame() {
    this.games.length = 0;
    this.loading = true;
    this.gameService
      .search(this.numberOfGames, this.platformId, this.startDate, this.endDate)
      .subscribe(
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
