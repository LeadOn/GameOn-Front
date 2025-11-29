import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HalterodataPocLayoutComponent } from './halterodata-poc-layout.component';
import { HalterodataPocHomeComponent } from './home/halterodata-poc-home.component';
import { canActivateAuthRole } from '../../core/guards/auth.guard';
import { HalterodataPocAthleteComponent } from './athlete/halterodata-poc-athlete.component';

const routes: Routes = [
  {
    path: '',
    component: HalterodataPocLayoutComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'gameon_admin' },
    children: [
      {
        path: '',
        component: HalterodataPocHomeComponent,
      },
      {
        path: 'athlete/:id',
        component: HalterodataPocAthleteComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HalterodataPocRoutingModule {}
