import { Component, Input } from '@angular/core';
import {
  faEdit,
  faExternalLinkAlt,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { KeycloakService } from 'keycloak-angular';
import { GameOnAdminService } from '../../../admin/shared/services/gameon-admin.service';
import { FifaGamePlayed } from '../../../shared/classes/fifa/FifaGamePlayed';

@Component({
  selector: 'app-fifa-game-history-card',
  templateUrl: './fifa-game-history-card.component.html',
  styleUrls: ['./fifa-game-history-card.component.scss'],
  standalone: false,
})
export class FifaGameHistoryCardComponent {
  @Input()
  game: FifaGamePlayed = new FifaGamePlayed();

  @Input()
  admin = false;

  externalIcon = faExternalLinkAlt;
  editIcon = faEdit;
  deleteIcon = faTrash;

  isAdmin = false;

  constructor(
    private adminService: GameOnAdminService,
    private keycloakService: KeycloakService
  ) {
    if (keycloakService.isUserInRole('gameon_admin')) {
      this.isAdmin = true;
    }
  }

  deleteGame(game: FifaGamePlayed) {
    if (
      this.keycloakService.isUserInRole('gameon_admin') &&
      confirm(
        'Voulez-vous vraiment supprimer le match ' +
          game.id +
          '? ATTENTION : cette action est irréversible !'
      )
    ) {
      this.adminService.deleteGame(game.id).subscribe(
        (data) => {
          alert('Suppression réussie !');
          window.location.reload();
        },
        (err) => {
          console.error(err);
          alert('Erreur lors de la suppression du match.');
        }
      );
    }
  }
}
