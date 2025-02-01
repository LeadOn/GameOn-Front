import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { LolRoutingModule } from './lol-routing.module';
import { LolPlayerCardComponent } from './components/lol-player-card/lol-player-card.component';
import { LolHomeComponent } from './lol-home.component';
import { LolGameDetailsPlayerGraphComponent } from './components/lol-game-details-player-graph/lol-game-details-player-graph.component';
import { LolGameDetailsPlayerComponent } from './components/lol-game-details-player/lol-game-details-player.component';
import { LolGameCardComponent } from './components/lol-game-card/lol-game-card.component';
import { LolGameDetailsComponent } from './games/details/lol-game-details.component';
import { LolPlayerDetailsComponent } from './player/lol-player-details.component';
import { RankHistoryComponent } from './player/components/rank-history/rank-history.component';
import { WinRateChartComponent } from './player/components/win-rate-chart/win-rate-chart.component';

@NgModule({
  declarations: [
    /* Pages */
    LolHomeComponent,
    LolGameDetailsComponent,
    LolPlayerDetailsComponent,

    /* Components */
    LolPlayerCardComponent,
    LolGameDetailsPlayerGraphComponent,
    LolGameDetailsPlayerComponent,
    LolGameCardComponent,
    RankHistoryComponent,
    WinRateChartComponent,
  ],
  imports: [LolRoutingModule, SharedModule],
})
export class LolModule {}
