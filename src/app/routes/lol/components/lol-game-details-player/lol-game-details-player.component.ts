import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import { faList } from '@fortawesome/free-solid-svg-icons';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-lol-game-details-player',
  standalone: false,

  templateUrl: './lol-game-details-player.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './lol-game-details-player.component.css',
})
export class LolGameDetailsPlayerComponent implements OnInit {
  @Input()
  player: LoLGameParticipant = new LoLGameParticipant();

  @Input()
  isSelected = false;

  @Output()
  playerSelected = new EventEmitter<LoLGameParticipant>();

  lolVersion$: Observable<string>;

  currentLoLPatch = '';
  detailsIcon = faList;

  constructor(private lolStore: Store<{ lolVersion: string }>) {
    this.lolVersion$ = this.lolStore.select('lolVersion');
  }

  ngOnInit(): void {
    this.lolVersion$.subscribe((version) => {
      this.currentLoLPatch = version;
    });
  }

  selectPlayer() {
    this.playerSelected.emit(this.player);
  }

  get itemSlots(): number[] {
    return [
      this.player.item0,
      this.player.item1,
      this.player.item2,
      this.player.item3,
      this.player.item4,
      this.player.item5,
      this.player.item6,
    ];
  }

  get kda(): number {
    const denominator = this.player.deaths === 0 ? 1 : this.player.deaths;
    return (this.player.kills + this.player.assists) / denominator;
  }

  get kdaLabel(): string {
    return this.kda.toFixed(2).replace('.', ',');
  }

  get kdaColorClass(): string {
    if (this.kda >= 4) {
      return 'text-customGreen';
    }

    if (this.kda >= 2) {
      return 'text-customYellow';
    }

    return 'text-frenchRed';
  }

  itemIconUrl(item: number): string {
    return `https://ddragon.leagueoflegends.com/cdn/${this.currentLoLPatch}/img/item/${item}.png`;
  }
}
