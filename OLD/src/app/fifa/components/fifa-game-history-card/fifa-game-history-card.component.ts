import {Component, Input} from "@angular/core";
import {
  faEdit,
  faExternalLinkAlt,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import {KeycloakService} from "keycloak-angular";
import {GameOnAdminService} from "src/app/admin/shared/services/gameon-admin.service";
import {FifaGamePlayed} from "src/app/shared/classes/FifaGamePlayed";

@Component({
  selector: "app-fifa-game-history-card",
  templateUrl: "./fifa-game-history-card.component.html",
  styleUrls: ["./fifa-game-history-card.component.scss"],
})
export class FifaGameHistoryCardComponent {
  @Input()
  game: FifaGamePlayed = new FifaGamePlayed();

  @Input()
  admin = false;

  externalIcon = faExternalLinkAlt;
  editIcon = faEdit;
  deleteIcon = faTrash;

  constructor(
    private adminService: GameOnAdminService,
    private keycloakService: KeycloakService
  ) {}

  deleteGame(game: FifaGamePlayed) {
    if (
      this.keycloakService.isUserInRole("GameOn_admin") &&
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
