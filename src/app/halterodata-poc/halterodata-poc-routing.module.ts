import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { canActivateAuthRole } from '../core/guards/auth.guard';
import { HalterodataPocLayoutComponent } from './halterodata-poc-layout.component';
import { HalterodataPocHomeComponent } from './home/halterodata-poc-home.component';

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HalterodataPocRoutingModule {}
