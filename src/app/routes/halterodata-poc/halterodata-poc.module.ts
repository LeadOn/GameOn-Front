import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HalterodataPocRoutingModule } from './halterodata-poc-routing.module';
import { HalterodataPocLayoutComponent } from './halterodata-poc-layout.component';
import { HalterodataPocHomeComponent } from './home/halterodata-poc-home.component';
import { PinnedAthleteCardComponent } from './shared/components/pinned-athlete-card/pinned-athlete-card.component';
import { HalterodataPocAthleteComponent } from './athlete/halterodata-poc-athlete.component';
import { SharedModule } from '../../shared/modules/shared.module';
import { CompetitionsTableComponent } from './shared/components/competitions-table/competitions-table.component';
import { HalterodataPocCompetitionComponent } from './competition/halterodata-poc-competition.component';

@NgModule({
  declarations: [
    HalterodataPocLayoutComponent,
    HalterodataPocHomeComponent,
    PinnedAthleteCardComponent,
    HalterodataPocAthleteComponent,
    CompetitionsTableComponent,
    HalterodataPocCompetitionComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    HalterodataPocRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class HalterodataPocModule {}
