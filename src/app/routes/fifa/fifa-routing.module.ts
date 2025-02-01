import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FifaHomeComponent } from './fifa-home.component';
import { FifaCreateGameComponent } from './create/fifa-create-game.component';
import { FifaGameDetailsComponent } from './details/fifa-game-details.component';
import { TournamentsHomeComponent } from './tournaments/tournaments-home.component';
import { TournamentsDetailsComponent } from './tournaments/details/tournaments-details.component';
import { FifaGlobalStatsComponent } from './global-stats/fifa-global-stats.component';
import { CommonLayoutComponent } from '../../shared/layouts/common-layout.component';
import { canActivateAuthRole } from '../../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: CommonLayoutComponent,
    children: [
      {
        path: '',
        component: FifaHomeComponent,
      },
      {
        path: 'global-stats',
        component: FifaGlobalStatsComponent,
      },
      {
        path: 'create',
        component: FifaCreateGameComponent,
        canActivate: [canActivateAuthRole],
        data: { role: 'default-roles-gameon' },
      },
      {
        path: 'details/:id',
        component: FifaGameDetailsComponent,
      },
      {
        path: 'tournaments',
        component: TournamentsHomeComponent,
      },
      {
        path: 'tournaments/:id',
        component: TournamentsDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FifaRoutingModule {}
