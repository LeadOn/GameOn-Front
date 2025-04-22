import { Component, inject, Input } from '@angular/core';
import {
  faEdit,
  faExternalLinkAlt,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import Keycloak from 'keycloak-js';
import { FifaGamePlayed } from '../../../../shared/classes/fifa/FifaGamePlayed';
import { GameOnAdminService } from '../../../../admin/shared/services/gameon-admin.service';

@Component({
  selector: 'app-fifa-game-history-card',
  templateUrl: './fifa-game-history-card.component.html',
  styleUrls: ['./fifa-game-history-card.component.css'],
  standalone: false,
})
export class FifaGameHistoryCardComponent {
  private readonly keycloak = inject(Keycloak);

  @Input()
  game?: FifaGamePlayed;

  @Input()
  admin = false;

  externalIcon = faExternalLinkAlt;
  editIcon = faEdit;
  deleteIcon = faTrash;

  isAdmin = false;

  constructor(private adminService: GameOnAdminService) {
    if (this.keycloak.hasRealmRole('gameon_admin')) {
      this.isAdmin = true;
    }
  }

  deleteGame(game: FifaGamePlayed) {
    if (
      this.isAdmin &&
      confirm(
        'Voulez-vous vraiment supprimer le match ' +
          game.id +
          '? ATTENTION : cette action est irréversible !',
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
        },
      );
    }
  }
}
