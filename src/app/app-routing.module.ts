import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CommonLayoutComponent } from './shared/layouts/common-layout.component';
import { NotFoundComponent } from './components/not-found/not-found.component';
import { HomeComponent } from './home/home.component';
import { ProfilePageComponent } from './players/me/profile.component';
import { AuthGuard } from './shared/guards/auth.guard';

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
        path: 'player/me',
        component: ProfilePageComponent,
        canActivate: [AuthGuard],
      },
      // {
      //   path: 'player/:id',
      //   component: PlayerDetailsComponent,
      // },
    ],
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
