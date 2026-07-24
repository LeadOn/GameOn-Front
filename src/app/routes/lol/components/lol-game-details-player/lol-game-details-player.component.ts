import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { faChevronDown, faList } from '@fortawesome/free-solid-svg-icons';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { LoLGameTimelineFrame } from '../../../../shared/classes/lol/LoLGameTimelineFrame';
import {
  championIconUrl,
  creepScoreFor,
  decimalLabel,
  formatFull,
  goldEarnedFor,
  itemIconUrl,
  itemSlots,
  kda,
  kdaColorClass,
  kdaLabel,
  killParticipationFor,
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
  expandIcon = faChevronDown;

  showAdvancedStats = false;

  selectPlayer() {
    this.playerSelected.emit(this.player);
  }

  toggleAdvancedStats(event: Event) {
    event.stopPropagation();
    this.showAdvancedStats = !this.showAdvancedStats;
  }

  get itemSlots(): number[] {
    return itemSlots(this.player);
  }

  get cs(): number {
    return creepScoreFor(this.player, this.timeline);
  }

  get currentGold(): number {
    return goldEarnedFor(this.player, this.timeline);
  }

  get killParticipation(): number {
    return killParticipationFor(this.player, this.team);
  }

  get hasAdvancedStats(): boolean {
    return this.player.stats != null;
  }

  get csPerMinuteLabel(): string {
    return decimalLabel(this.player.stats?.csPerMinute ?? 0);
  }

  get damageDealtToChampionsLabel(): string {
    return formatFull(this.player.stats?.damageDealtToChampions ?? 0);
  }

  get damagePerMinuteLabel(): string {
    return formatFull(this.player.stats?.damagePerMinute ?? 0);
  }

  get goldPerMinuteLabel(): string {
    return formatFull(this.player.stats?.goldPerMinute ?? 0);
  }

  get damageTakenLabel(): string {
    return formatFull(this.player.stats?.damageTaken ?? 0);
  }

  get wardsPlaced(): number {
    return this.player.stats?.wardsPlaced ?? 0;
  }

  get wardsKilled(): number {
    return this.player.stats?.wardsKilled ?? 0;
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
