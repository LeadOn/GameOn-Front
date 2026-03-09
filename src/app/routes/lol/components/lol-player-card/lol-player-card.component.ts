import { Component, Input, OnInit } from '@angular/core';
import { PlayerDto } from '../../../../shared/classes/common/PlayerDto';
import { environment } from '../../../../../environments/environment';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-lol-player-card',
  templateUrl: './lol-player-card.component.html',
  styleUrl: './lol-player-card.component.css',
  standalone: false,
})
export class LolPlayerCardComponent implements OnInit {
  @Input()
  player: PlayerDto = new PlayerDto();

  lolVersion$: Observable<string>;

  constructor(private lolStore: Store<{ lolVersion: string }>) {
    this.lolVersion$ = this.lolStore.select('lolVersion');
  }

  currentLoLPatch: string = '';
  apiUrl: string = environment.gameOnApiUrl;

  ngOnInit(): void {
    this.lolVersion$.subscribe((version) => {
      this.currentLoLPatch = version;
    });
  }
}
