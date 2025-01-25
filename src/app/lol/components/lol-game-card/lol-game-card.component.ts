import { Component, Input } from '@angular/core';
import { LoLGame } from '../../../shared/classes/lol/LoLGame';

@Component({
  selector: 'app-lol-game-card',
  standalone: false,

  templateUrl: './lol-game-card.component.html',
  styleUrl: './lol-game-card.component.scss',
})
export class LolGameCardComponent {
  @Input()
  game: LoLGame = new LoLGame();
}
