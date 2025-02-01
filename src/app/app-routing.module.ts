import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonLayoutComponent } from './shared/layouts/common-layout.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { DonateComponent } from './routes/donate/donate.component';
import { LolPlayerDetailsComponent } from './lol/player/lol-player-details.component';
import { LolGameDetailsComponent } from './lol/games/details/lol-game-details.component';
import { canActivateAuthRole } from './core/guards/auth.guard';
import { ChangelogComponent } from './routes/changelog/changelog.component';
import { HomeComponent } from './routes/home/home.component';
import { ProfilePageComponent } from './routes/profile/profile.component';
import { FifaPlayerDetailsComponent } from './routes/fifa/player/fifa-player-details.component';
import { LolHomeComponent } from './lol/lol-home.component';

export const routes: Routes = [
  {
    path: '',
    component: CommonLayoutComponent,
    children: [
      {
        path: '',
        component: HomeComponent,
      },
      {
        path: 'home',
        component: HomeComponent,
      },
      {
        path: 'changelog',
        component: ChangelogComponent,
      },
      {
        path: 'donate',
        component: DonateComponent,
      },
      {
        path: 'player/me',
        component: ProfilePageComponent,
        canActivate: [canActivateAuthRole],
        data: { role: 'default-roles-gameon' },
      },
      {
        path: 'player/:id',
        component: FifaPlayerDetailsComponent,
      },
      {
        path: 'lol',
        component: LolHomeComponent,
      },
      {
        path: 'lol/summoner/:id',
        component: LolPlayerDetailsComponent,
      },
      {
        path: 'lol/game/:id/:playerId',
        component: LolGameDetailsComponent,
      },
    ],
  },
  {
    path: 'lolbeta',
    loadChildren: () =>
      import('./routes/lol/lol.module').then((m) => m.LolModule),
  },
  {
    path: 'fifa',
    loadChildren: () =>
      import('./routes/fifa/fifa.module').then((m) => m.FifaModule),
  },
  {
    path: 'admin',
    loadChildren: () =>
      import('./admin/admin.module').then((m) => m.AdminModule),
  },
  {
    path: '**',
    component: CommonLayoutComponent,
    children: [
      {
        path: '**',
        component: NotFoundComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
