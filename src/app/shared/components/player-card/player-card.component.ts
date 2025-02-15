import { Component, Input } from '@angular/core';
import { Player } from '../../classes/common/Player';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.css'],
  standalone: false,
})
export class PlayerCardComponent {
  @Input()
  player: Player = new Player();

  constructor() {}
}
