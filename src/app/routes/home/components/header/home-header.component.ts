import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Season } from '../../../../shared/classes/fifa/Season';
import { Player } from '../../../../shared/classes/common/Player';

@Component({
  selector: 'app-home-header',
  templateUrl: './home-header.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HomeHeaderComponent {
  @Input()
  season?: Season;

  @Input()
  isLoggedIn: boolean = false;

  player$: Observable<Player>;

  today = new Date();

  constructor(private playerStore: Store<{ player: Player }>) {
    this.player$ = this.playerStore.select('player');
  }
}
