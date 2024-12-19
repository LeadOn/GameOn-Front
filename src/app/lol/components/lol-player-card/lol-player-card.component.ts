import { Component, Input } from '@angular/core';
import { PlayerDto } from '../../../shared/classes/PlayerDto';

@Component({
  selector: 'app-lol-player-card',
  templateUrl: './lol-player-card.component.html',
  styleUrl: './lol-player-card.component.scss',
})
export class LolPlayerCardComponent {
  @Input()
  player: PlayerDto = new PlayerDto();
}
