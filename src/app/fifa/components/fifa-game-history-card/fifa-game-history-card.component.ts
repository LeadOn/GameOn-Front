import { Component, Input } from "@angular/core";
import {
  faEdit,
  faExternalLinkAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { KeycloakService } from "keycloak-angular";
import { YuGamesAdminService } from "src/app/admin/shared/services/yugames-admin.service";
import { GamePlayed } from "src/app/shared/classes/GamePlayed";

@Component({
  selector: "app-fifa-game-history-card",
  templateUrl: "./fifa-game-history-card.component.html",
  styleUrls: ["./fifa-game-history-card.component.scss"],
})
export class FifaGameHistoryCardComponent {
  @Input()
  game: GamePlayed = new GamePlayed();

  @Input()
  admin = false;

  externalIcon = faExternalLinkAlt;
  editIcon = faEdit;
  deleteIcon = faTrash;

  constructor(
    private adminService: YuGamesAdminService,
    private keycloakService: KeycloakService
  ) {}

  deleteGame(game: GamePlayed) {
    if (
      this.keycloakService.isUserInRole("yugames_admin") &&
      confirm(
        "Voulez-vous vraiment supprimer le match " +
          game.id +
          "? ATTENTION : cette action est irréversible !"
      )
    ) {
      this.adminService.deleteGame(game.id).subscribe(
        (data) => {
          alert("Suppression réussie !");
          window.location.reload();
        },
        (err) => {
          console.error(err);
          alert("Erreur lors de la suppression du match.");
        }
      );
    }
  }
}
