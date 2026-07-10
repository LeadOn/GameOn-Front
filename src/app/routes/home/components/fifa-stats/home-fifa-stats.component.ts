import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  faChartPie,
  faFire,
  faBullseye,
} from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Player } from '../../../../shared/classes/common/Player';
import { PlatformStatsDto } from '../../../../shared/classes/common/PlatformStatsDto';
import { GameOnPlayerService } from '../../../../shared/services/common/gameon-player.service';
import { setPlayerStats } from '../../../../core/store/actions/player.actions';

@Component({
  selector: 'app-home-fifa-stats',
  templateUrl: './home-fifa-stats.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HomeFifaStatsComponent implements OnChanges {
  @Input()
  isLoggedIn: boolean = false;

  @Input()
  loading: boolean = true;

  player$: Observable<Player>;
  globalStats$: Observable<PlatformStatsDto>;

  seasonIcon = faChartPie;
  formIcon = faFire;
  goalsIcon = faBullseye;

  // Placeholder : pas de notion de "série en cours" côté API pour le moment.
  mockStreak = 3;
  mockForm: ('V' | 'D' | 'N')[] = ['V', 'V', 'V', 'N', 'D'];

  constructor(
    private playerStore: Store<{ player: Player }>,
    private statsStore: Store<{ globalStats: PlatformStatsDto }>,
    private playerService: GameOnPlayerService,
  ) {
    this.player$ = this.playerStore.select('player');
    this.globalStats$ = statsStore.select('globalStats');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLoggedIn'])
      this.isLoggedIn = changes['isLoggedIn'].currentValue;

    this.getPlayerStats();
  }

  getPlayerStats() {
    if (this.isLoggedIn) {
      this.player$.subscribe((x) => {
        this.playerService.getStats(x.id).subscribe((data) => {
          if (
            data != null &&
            data.statsPerPlatform != null &&
            data.statsPerPlatform.length > 0
          ) {
            this.statsStore.dispatch(
              setPlayerStats({ globalStats: data.statsPerPlatform[0] }),
            );
          }
        });
      });
    }
  }

  totalMatches(stat: PlatformStatsDto): number {
    return stat.wins + stat.losses + stat.draws;
  }
}
