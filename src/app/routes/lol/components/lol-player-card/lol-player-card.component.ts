import { Component, Input } from '@angular/core';
import { PlayerDto } from '../../../../shared/classes/common/PlayerDto';
import { environment } from '../../../../../environments/environment';

@Component({
  selector: 'app-lol-player-card',
  templateUrl: './lol-player-card.component.html',
  styleUrl: './lol-player-card.component.css',
  standalone: false,
})
export class LolPlayerCardComponent {
  @Input()
  player: PlayerDto = new PlayerDto();

  currentLoLPatch: string = environment.currentLoLPatch;
  apiUrl: string = environment.gameOnApiUrl;
}
