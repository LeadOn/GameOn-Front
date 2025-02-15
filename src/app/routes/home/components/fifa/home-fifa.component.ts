import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { faFutbol, faTrophy } from '@fortawesome/free-solid-svg-icons';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { Season } from '../../../../shared/classes/fifa/Season';
import { Tournament } from '../../../../shared/classes/fifa/Tournament';
import { Player } from '../../../../shared/classes/common/Player';
import { PlatformStatsDto } from '../../../../shared/classes/common/PlatformStatsDto';
import { FifaGamePlayed } from '../../../../shared/classes/fifa/FifaGamePlayed';
import { GameOnGameService } from '../../../../shared/services/fifa/gameon-game.service';
import { GameOnPlayerService } from '../../../../shared/services/common/gameon-player.service';
import { setPlayerStats } from '../../../../core/store/actions/player.actions';

@Component({
  selector: 'app-home-fifa',
  templateUrl: './home-fifa.component.html',
  styleUrl: './home-fifa.component.css',
  standalone: false,
})
export class HomeFifaComponent implements OnChanges {
  @Input()
  loading: boolean = true;

  @Input()
  season?: Season;

  @Input()
  tournaments?: Tournament[];

  @Input()
  isLoggedIn: boolean = false;

  player$: Observable<Player>;
  globalStats$: Observable<PlatformStatsDto>;

  playerNickname = '';

  loadingPlannedMatches = true;
  loadingLastMatches = true;
  plannedMatchesError = false;
  lastMatchesError = false;
  plannedMatches: FifaGamePlayed[] = [];
  lastMatches: FifaGamePlayed[] = [];

  soccerIcon = faFutbol;
  tournamentIcon = faTrophy;

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
    if (changes['loading']) this.loading = changes['loading'].currentValue;

    if (changes['season']) this.season = changes['season'].currentValue;

    if (changes['tournaments'])
      this.tournaments = changes['tournaments'].currentValue;

    if (changes['isLoggedIn'])
      this.isLoggedIn = changes['isLoggedIn'].currentValue;

    this.getPlayerStats();
    this.getPlannedMatches();
    this.getLastMatches();
  }

  getPlayerStats() {
    if (this.isLoggedIn) {
      this.player$.subscribe((x) => {
        if (x.nickname.length <= 5) {
          this.playerNickname = x.nickname;
        } else {
          this.playerNickname = x.nickname.substring(0, 5) + '...';
        }

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

  getPlannedMatches() {
    if (this.isLoggedIn) {
      this.player$.subscribe((x) => {
        this.gameService.getPlanned(x.id, 5).subscribe(
          (data) => {
            this.plannedMatches = data;
            this.loadingPlannedMatches = false;
          },
          (err) => {
            console.error(err);
            this.plannedMatchesError = true;
          },
        );
      });
    }
  }

  getLastMatches() {
    if (this.isLoggedIn) {
      this.player$.subscribe((x) => {
        this.gameService.getLastByPlayer(x.id, 5).subscribe(
          (data) => {
            this.lastMatches = data;
            this.loadingLastMatches = false;
          },
          (err) => {
            console.error(err);
            this.lastMatchesError = true;
          },
        );
      });
    } else {
      this.gameService.getLast(5).subscribe(
        (data) => {
          this.lastMatches = data;
          this.loadingLastMatches = false;
        },
        (err) => {
          console.error(err);
          this.lastMatchesError = true;
        },
      );
    }
  }
}
