import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { LolRoutingModule } from './lol-routing.module';
import { LolPlayerCardComponent } from './components/lol-player-card/lol-player-card.component';
import { LolHomeComponent } from './lol-home.component';

@NgModule({
  declarations: [
    /* Pages */
    LolHomeComponent,
    /* Components */
    LolPlayerCardComponent,
  ],
  imports: [LolRoutingModule, SharedModule],
})
export class LolModule {}
