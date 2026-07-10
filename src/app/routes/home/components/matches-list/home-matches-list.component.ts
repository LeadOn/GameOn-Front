import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Player } from '../../../../shared/classes/common/Player';
import { FifaGamePlayed } from '../../../../shared/classes/fifa/FifaGamePlayed';
import { GameOnGameService } from '../../../../shared/services/fifa/gameon-game.service';

@Component({
  selector: 'app-home-matches-list',
  templateUrl: './home-matches-list.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HomeMatchesListComponent implements OnChanges {
  @Input()
  isLoggedIn: boolean = false;

  player$: Observable<Player>;

  loading = true;
  error = false;
  games: FifaGamePlayed[] = [];

  errorIcon = faExclamationCircle;

  constructor(
    private playerStore: Store<{ player: Player }>,
    private gameService: GameOnGameService,
  ) {
    this.player$ = this.playerStore.select('player');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLoggedIn'])
      this.isLoggedIn = changes['isLoggedIn'].currentValue;

    this.getMatches();
  }

  getMatches() {
    if (this.isLoggedIn) {
      this.player$.subscribe((x) => {
        this.gameService.getPlanned(x.id, 1).subscribe((planned) => {
          this.gameService.getLastByPlayer(x.id, 4).subscribe(
            (last) => {
              this.games = [...planned, ...last];
              this.loading = false;
            },
            (err) => {
              console.error(err);
              this.error = true;
            },
          );
        });
      });
    } else {
      this.gameService.getLast(5).subscribe(
        (data) => {
          this.games = data;
          this.loading = false;
        },
        (err) => {
          console.error(err);
          this.error = true;
        },
      );
    }
  }
}
