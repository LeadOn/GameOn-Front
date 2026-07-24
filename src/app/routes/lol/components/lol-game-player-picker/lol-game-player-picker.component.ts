import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { championIconUrl } from '../../../../shared/classes/lol/lol-match.util';

@Component({
  selector: 'app-lol-game-player-picker',
  standalone: false,
  templateUrl: './lol-game-player-picker.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGamePlayerPickerComponent {
  /** Expected pre-grouped by team (blue side first), as `allPlayers` is. */
  @Input()
  players: LoLGameParticipant[] = [];

  @Input()
  selectedPuuid?: string;

  @Input()
  patch = '';

  @Output()
  playerSelected = new EventEmitter<LoLGameParticipant>();

  select(player: LoLGameParticipant): void {
    this.playerSelected.emit(player);
  }

  championIconUrl(player: LoLGameParticipant): string {
    return championIconUrl(player.championName, this.patch);
  }

  displayName(player: LoLGameParticipant): string {
    return player.riotIdGameName || 'Inconnu';
  }

  ringClass(player: LoLGameParticipant): string {
    return player.teamId === 100 ? 'ring-mpGreen' : 'ring-mpRed';
  }

  pillClass(player: LoLGameParticipant): string {
    return player.puuid === this.selectedPuuid
      ? 'border-mpYellow/60 bg-mpYellow/10 text-mpYellowInk'
      : 'border-mpBorder text-mpTextSecondary hover:text-mpText light:bg-[rgba(23,30,54,0.03)] bg-white/5 hover:bg-white/10';
  }
}
