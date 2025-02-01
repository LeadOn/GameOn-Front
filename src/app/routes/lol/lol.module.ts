import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { LolRoutingModule } from './lol-routing.module';
import { LolPlayerCardComponent } from './components/lol-player-card/lol-player-card.component';

@NgModule({
  declarations: [LolPlayerCardComponent],
  imports: [LolRoutingModule, SharedModule],
})
export class LolModule {}
