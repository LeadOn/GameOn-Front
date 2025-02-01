import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { LolRoutingModule } from './lol-routing.module';
import { LolPlayerCardComponent } from './components/lol-player-card/lol-player-card.component';
import { LolHomeComponent } from './lol-home.component';
import { LolGameDetailsPlayerGraphComponent } from './components/lol-game-details-player-graph/lol-game-details-player-graph.component';
import { LolGameDetailsPlayerComponent } from './components/lol-game-details-player/lol-game-details-player.component';

@NgModule({
  declarations: [
    /* Pages */
    LolHomeComponent,
    /* Components */
    LolPlayerCardComponent,
    LolGameDetailsPlayerGraphComponent,
    LolGameDetailsPlayerComponent,
  ],
  imports: [LolRoutingModule, SharedModule],
})
export class LolModule {}
