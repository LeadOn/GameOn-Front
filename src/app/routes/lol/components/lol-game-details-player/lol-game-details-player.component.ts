import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  championIconUrl,
  csFor,
  itemIconUrl,
  itemSlots,
  kda,
  kdaColorClass,
  kdaLabel,
  killParticipation,
  latestStatsFor,
  playerDisplayName,
} from '../../../../shared/classes/lol/lol-match.util';

@Component({
  selector: 'app-lol-game-details-player',
  standalone: false,

  templateUrl: './lol-game-details-player.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lol-game-details-player.component.css',
})
export class LolGameDetailsPlayerComponent {
  @Input()
  player: LoLGameParticipant = new LoLGameParticipant();

  @Input()
  team: LoLGameParticipant[] = [];

  @Input()
  timeline?: LoLGameTimelineFrame[];

  @Input()
  isSelected = false;

  @Input()
  isMvp = false;

  @Input()
  isAce = false;

  @Input()
  patch = '';

  @Output()
  playerSelected = new EventEmitter<LoLGameParticipant>();

  detailsIcon = faList;

  selectPlayer() {
    this.playerSelected.emit(this.player);
  }

  get itemSlots(): number[] {
    return itemSlots(this.player);
  }

  get cs(): number {
    return csFor(this.timeline, this.player.puuid);
  }

  get currentGold(): number {
    return latestStatsFor(this.timeline, this.player.puuid)?.totalGold ?? 0;
  }

  get killParticipation(): number {
    return killParticipation(this.player, this.team);
  }

  get kdaValue(): number {
    return kda(this.player);
  }

  get kdaLabel(): string {
    return kdaLabel(this.player);
  }

  get kdaColorClass(): string {
    return kdaColorClass(this.kdaValue);
  }

  get displayName(): string {
    return playerDisplayName(this.player);
  }

  get isLinkedToGameOn(): boolean {
    return this.player.player != null;
  }

  championIconUrl(): string {
    return championIconUrl(this.player.championName, this.patch);
  }

  itemIconUrl(item: number): string {
    return itemIconUrl(item, this.patch);
  }
}
