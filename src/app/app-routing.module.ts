import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonLayoutComponent } from './shared/layouts/common-layout.component';
import { NotFoundComponent } from './shared/components/not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { ProfilePageComponent } from './players/me/profile.component';
import { AuthGuard } from './shared/guards/auth.guard';
import { PlayerDetailsComponent } from './players/details/player-details.component';
import { ChangelogComponent } from './changelog/changelog.component';
import { DonateComponent } from './donate/donate.component';
import { FiveComponent } from './five/five.component';
import { FiveDetailsComponent } from './five/details/five-details.component';
import { CreateFiveComponent } from './five/create/five-create.component';
import { LolHomeComponent } from './lol/lol-home.component';
import { LolPlayerDetailsComponent } from './lol/player/lol-player-details.component';
import { LolGameDetailsComponent } from './lol/games/details/lol-game-details.component';

const routes: Routes = [
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
        path: 'soccerfive',
        component: FiveComponent,
      },
      {
        path: 'soccerfive/create',
        component: CreateFiveComponent,
      },
      {
        path: 'soccerfive/:id',
        component: FiveDetailsComponent,
      },
      {
        path: 'player/me',
        component: ProfilePageComponent,
        canActivate: [AuthGuard],
      },
      {
        path: 'player/:id',
        component: PlayerDetailsComponent,
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
        path: 'lol/game/:id',
        component: LolGameDetailsComponent,
      },
    ],
  },
  {
    path: 'fifa',
    loadChildren: () => import('./fifa/fifa.module').then((m) => m.FifaModule),
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
