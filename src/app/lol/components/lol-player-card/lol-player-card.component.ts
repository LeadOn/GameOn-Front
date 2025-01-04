import { Component, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { PlayerDto } from '../../../shared/classes/common/PlayerDto';

@Component({
  selector: 'app-lol-player-card',
  templateUrl: './lol-player-card.component.html',
  styleUrl: './lol-player-card.component.scss',
  standalone: false,
})
export class LolPlayerCardComponent {
  @Input()
  player: PlayerDto = new PlayerDto();

  currentLoLPatch: string = environment.currentLoLPatch;
}
