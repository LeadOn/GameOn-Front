import { Component, OnInit } from "@angular/core";
import { faExternalLinkAlt, faFilter } from "@fortawesome/free-solid-svg-icons";
import { KeycloakService } from "keycloak-angular";
import { FifaGamePlayed } from "src/app/shared/classes/FifaGamePlayed";
import { Platform } from "src/app/shared/classes/Platform";
import { YuGamesGameService } from "src/app/shared/services/yugames-game.service";
import { YuGamesPlatformService } from "src/app/shared/services/yugames-platform.service";
import { trigger, style, animate, transition } from "@angular/animations";

@Component({
  selector: "app-fifa-home",
  templateUrl: "./fifa-home.component.html",
  styleUrls: ["./fifa-home.component.scss"],
  animations: [
    trigger("inOutAnimation", [
      transition(":enter", [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 })),
      ]),
      transition(":leave", [
        style({ opacity: 1 }),
        animate(200, style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class FifaHomeComponent implements OnInit {
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
    this.isLoggedIn = this.keycloak.isLoggedIn();
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
