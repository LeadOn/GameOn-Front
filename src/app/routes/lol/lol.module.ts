import { NgModule } from '@angular/core';
import { Store } from '@ngrx/store';
import { SharedModule } from '../../shared/modules/shared.module';
import { LolRoutingModule } from './lol-routing.module';
import { LolPlayerCardComponent } from './components/lol-player-card/lol-player-card.component';
import { LolHomeComponent } from './lol-home.component';
import { LolGameDetailsPlayerComponent } from './components/lol-game-details-player/lol-game-details-player.component';
import { LolGameGoldChartComponent } from './components/lol-game-gold-chart/lol-game-gold-chart.component';
import { LolGameGoldRaceComponent } from './components/lol-game-gold-race/lol-game-gold-race.component';
import { LolGameDamageChartComponent } from './components/lol-game-damage-chart/lol-game-damage-chart.component';
import { LolGameHighlightsComponent } from './components/lol-game-highlights/lol-game-highlights.component';
import { LolGameCardComponent } from './components/lol-game-card/lol-game-card.component';
import { LolGameDetailsComponent } from './games/details/lol-game-details.component';
import { LolPlayerDetailsComponent } from './player/lol-player-details.component';
import { RankHistoryComponent } from './player/components/rank-history/rank-history.component';
import { WinRateChartComponent } from './player/components/win-rate-chart/win-rate-chart.component';
import { LolFunStatsComponent } from './components/lol-fun-stats/lol-fun-stats.component';
import { LolImportGameComponent } from './components/import-game/lol-import-game.component';
import { GameOnLoLService } from '../../shared/services/leagueoflegends/gameon-lol.service';
import { setLoLQueues } from '../../core/store/actions/lol.actions';
import { LoLQueue } from '../../shared/classes/lol/LoLQueue';

@NgModule({
  declarations: [
    /* Pages */
    LolHomeComponent,
    LolGameDetailsComponent,
    LolPlayerDetailsComponent,

    /* Components */
    LolPlayerCardComponent,
    LolGameDetailsPlayerComponent,
    LolGameGoldChartComponent,
    LolGameGoldRaceComponent,
    LolGameDamageChartComponent,
    LolGameHighlightsComponent,
    LolGameCardComponent,
    RankHistoryComponent,
    WinRateChartComponent,
    LolFunStatsComponent,
    LolImportGameComponent,
  ],
  imports: [LolRoutingModule, SharedModule],
})
export class LolModule {
  constructor(
    private lolService: GameOnLoLService,
    private store: Store<{ lolQueues: LoLQueue[] }>,
  ) {
    this.lolService.getQueues().subscribe(
      (queues) => {
        this.store.dispatch(setLoLQueues({ queues }));
      },
      (err) => {
        console.error('[LolModule]', err);
      },
    );
  }
}
