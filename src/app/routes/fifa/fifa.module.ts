import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { FifaHomeComponent } from './fifa-home.component';
import { FifaRoutingModule } from './fifa-routing.module';
import { FifaGlobalStatsComponent } from './global-stats/fifa-global-stats.component';
import { FifaPlayerDetailsComponent } from './player/fifa-player-details.component';
import { TournamentsHomeComponent } from './tournaments/tournaments-home.component';
import { TournamentsDetailsComponent } from './tournaments/details/tournaments-details.component';
import { FifaCreateGameComponent } from './create/fifa-create-game.component';
import { FifaGameDetailsComponent } from './details/fifa-game-details.component';

@NgModule({
  declarations: [
    FifaHomeComponent,
    FifaGlobalStatsComponent,
    FifaPlayerDetailsComponent,
    FifaCreateGameComponent,
    FifaGameDetailsComponent,

    TournamentsHomeComponent,
    TournamentsDetailsComponent,
  ],
  imports: [FifaRoutingModule, SharedModule],
})
export class FifaModule {}
