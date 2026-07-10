import { Component, ChangeDetectionStrategy } from '@angular/core';
import { faShieldHalved } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-lol-season-card',
  templateUrl: './home-lol-season-card.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HomeLolSeasonCardComponent {
  // Placeholder : à brancher sur le rang du joueur courant une fois l'endpoint confirmé.
  tier = 'Platinum I';
  lp = 18;
  queueType = 'Solo Queue';

  rankIcon = faShieldHalved;
}
