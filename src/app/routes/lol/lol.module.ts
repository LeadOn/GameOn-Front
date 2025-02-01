import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/modules/shared.module';
import { LolRoutingModule } from './lol-routing.module';

@NgModule({
  // declarations: [LolHomeComponent],
  imports: [LolRoutingModule, SharedModule],
})
export class LolModule {}
