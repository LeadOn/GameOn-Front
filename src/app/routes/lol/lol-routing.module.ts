import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonLayoutComponent } from '../../shared/layouts/common-layout.component';
import { LolHomeComponent } from './lol-home.component';
import { LolGameDetailsComponent } from '../../lol/games/details/lol-game-details.component';
import { LolPlayerDetailsComponent } from '../../lol/player/lol-player-details.component';

const routes: Routes = [
  {
    path: '',
    component: CommonLayoutComponent,
    children: [
      {
        path: '',
        component: LolHomeComponent,
      },
      {
        path: 'summoner/:id',
        component: LolPlayerDetailsComponent,
      },
      {
        path: 'game/:id/:playerId',
        component: LolGameDetailsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LolRoutingModule {}
