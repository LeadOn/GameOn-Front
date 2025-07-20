import { Component, Input } from '@angular/core';
import { Player } from '../../classes/common/Player';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-player-card',
  templateUrl: './player-card.component.html',
  styleUrls: ['./player-card.component.css'],
  standalone: false,
})
export class PlayerCardComponent {
  @Input()
  player: Player = new Player();

  @Input()
  loading = false;

  apiUrl = environment.gameOnApiUrl;

  constructor() {}
}
