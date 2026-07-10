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
import { FifaGamePlayed } from '../../../../shared/classes/fifa/FifaGamePlayed';
import { GameOnPlayerService } from '../../../../shared/services/common/gameon-player.service';
import { GameOnGameService } from '../../../../shared/services/fifa/gameon-game.service';
import { setPlayerStats } from '../../../../core/store/actions/player.actions';

type GameResult = 'V' | 'D' | 'N';

const STREAK_LABELS: Record<GameResult, string> = {
  V: 'victoires de suite',
  D: 'défaites de suite',
  N: 'matchs nuls de suite',
};

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

  form: GameResult[] = [];
  streak = 0;
  streakType: GameResult = 'V';
  streakLabel = STREAK_LABELS.V;

  constructor(
    private playerStore: Store<{ player: Player }>,
    private statsStore: Store<{ globalStats: PlatformStatsDto }>,
    private playerService: GameOnPlayerService,
    private gameService: GameOnGameService,
  ) {
    this.player$ = this.playerStore.select('player');
    this.globalStats$ = statsStore.select('globalStats');
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isLoggedIn'])
      this.isLoggedIn = changes['isLoggedIn'].currentValue;

    this.getPlayerStats();
    this.getRecentForm();
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

  getRecentForm() {
    if (this.isLoggedIn) {
      this.player$.subscribe((x) => {
        this.gameService.getLastByPlayer(x.id, 5).subscribe((games) => {
          const results = games
            .filter((game) => game.isPlayed)
            .map((game) => this.resultForPlayer(game, x.id));

          this.form = [...results].reverse();

          if (results.length === 0) {
            this.streak = 0;
            return;
          }

          this.streakType = results[0];
          this.streak = results.findIndex((r) => r !== this.streakType);
          this.streak = this.streak === -1 ? results.length : this.streak;
          this.streakLabel = STREAK_LABELS[this.streakType];
        });
      });
    }
  }

  resultForPlayer(game: FifaGamePlayed, playerId: number): GameResult {
    const onTeam1 = game.team1.players.some((p) => p.id === playerId);
    const myScore = onTeam1 ? game.team1.score : game.team2.score;
    const opponentScore = onTeam1 ? game.team2.score : game.team1.score;

    if (myScore > opponentScore) return 'V';
    if (myScore < opponentScore) return 'D';
    return 'N';
  }

  totalMatches(stat: PlatformStatsDto): number {
    return stat.wins + stat.losses + stat.draws;
  }
}
