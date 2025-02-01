import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PlayerDto } from '../../../shared/classes/common/PlayerDto';

@Component({
  selector: 'app-lol-old-player-card',
  templateUrl: './lol-old-player-card.component.html',
  styleUrl: './lol-old-player-card.component.scss',
  standalone: false,
})
export class LolOldPlayerCardComponent {
  @Input()
  player: PlayerDto = new PlayerDto();

  currentLoLPatch: string = environment.currentLoLPatch;
}
