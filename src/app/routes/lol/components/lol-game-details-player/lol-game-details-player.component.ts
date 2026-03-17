import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { faExternalLink, faList } from '@fortawesome/free-solid-svg-icons';
import { LoLGameParticipant } from '../../../../shared/classes/lol/LoLGameParticipant';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-lol-game-details-player',
  standalone: false,

  templateUrl: './lol-game-details-player.component.html',
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
  externalIcon = faExternalLink;
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
}
