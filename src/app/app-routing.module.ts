import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonLayoutComponent } from './shared/layouts/common-layout.component';
import { canActivateAuthRole } from './core/guards/auth.guard';
import { ChangelogComponent } from './routes/changelog/changelog.component';
import { HomeComponent } from './routes/home/home.component';
import { ProfilePageComponent } from './routes/profile/profile.component';
import { FifaPlayerDetailsComponent } from './routes/fifa/player/fifa-player-details.component';

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
        path: 'player/me',
        component: ProfilePageComponent,
        canActivate: [canActivateAuthRole],
        data: { role: 'default-roles-gameon' },
      },
      {
        path: 'player/:id',
        component: FifaPlayerDetailsComponent,
      },
    ],
  },
  {
    path: 'lol',
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
        component: HomeComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
