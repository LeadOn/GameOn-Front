import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FifaHomeComponent } from './fifa-home.component';
import { FifaRoutingModule } from './fifa-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TournamentsHomeComponent } from './tournaments/tournaments-home.component';
import { TournamentsDetailsComponent } from './tournaments/details/tournaments-details.component';
import { FifaGlobalStatsComponent } from './global-stats/fifa-global-stats.component';
import { SharedModule } from '../../shared/modules/shared.module';

@NgModule({
  declarations: [
    FifaHomeComponent,
    TournamentsHomeComponent,
    TournamentsDetailsComponent,
    FifaGlobalStatsComponent,
  ],
  imports: [
    CommonModule,
    FifaRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class FifaModule {}
