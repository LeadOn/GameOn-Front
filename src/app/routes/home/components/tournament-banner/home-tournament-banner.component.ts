import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Tournament } from '../../../../shared/classes/fifa/Tournament';

@Component({
  selector: 'app-home-tournament-banner',
  templateUrl: './home-tournament-banner.component.html',
  styleUrl: './home-tournament-banner.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HomeTournamentBannerComponent {
  @Input()
  tournament?: Tournament;
}
