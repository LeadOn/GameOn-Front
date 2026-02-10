import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HalterodataPocLayoutComponent } from './halterodata-poc-layout.component';
import { HalterodataPocHomeComponent } from './home/halterodata-poc-home.component';
import { HalterodataPocAthleteComponent } from './athlete/halterodata-poc-athlete.component';
import { HalterodataPocCompetitionComponent } from './competition/halterodata-poc-competition.component';

const routes: Routes = [
  {
    path: '',
    component: HalterodataPocLayoutComponent,
    children: [
      {
        path: '',
        component: HalterodataPocHomeComponent,
      },
      {
        path: 'athlete/:id',
        component: HalterodataPocAthleteComponent,
      },
      {
        path: 'competition/:id',
        component: HalterodataPocCompetitionComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HalterodataPocRoutingModule {}
