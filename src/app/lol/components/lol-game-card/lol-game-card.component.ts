import { Component, Input } from '@angular/core';
import { faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';
import { LoLGame } from '../../../shared/classes/LoLGame';

@Component({
  selector: 'app-lol-game-card',
  templateUrl: './lol-game-card.component.html',
  styleUrls: ['./lol-game-card.component.scss'],
})
export class LoLGameCardComponent {
  @Input()
  game: LoLGame = new LoLGame();

  externalIcon = faExternalLinkAlt;

  constructor() {}
}
