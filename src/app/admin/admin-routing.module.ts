import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './home/admin-home.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminPlatformsComponent } from './platforms/admin-platforms.component';
import { AdminPlatformEditComponent } from './platforms/edit/admin-platform-edit.component';
import { AdminFifaGamesComponent } from './fifa-games/admin-fifa-games.component';
import { AdminFifaGameEditComponent } from './fifa-games/edit/admin-fifa-game-edit.component';
import { AdminPlayersComponent } from './players/admin-players.component';
import { AdminPlayerEditComponent } from './players/edit/admin-player-edit.component';
import { AdminHighlightsComponent } from './highlights/admin-highlights.component';
import { AdminSeasonsComponent } from './seasons/admin-seasons.component';
import { AdminEditTournamentComponent } from './tournaments/edit/admin-edit-tournament.component';
import { AdminCreateTournamentComponent } from './tournaments/create/admin-create-tournament.component';
import { AdminTournamentsComponent } from './tournaments/admin-tournaments.component';
import { canActivateAuthRole } from '../core/guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AdminLayoutComponent,
    canActivate: [canActivateAuthRole],
    data: { role: 'gameon_admin' },
    children: [
      {
        path: '',
        component: AdminHomeComponent,
      },
      {
        path: 'platforms',
        component: AdminPlatformsComponent,
      },
      {
        path: 'platforms/edit/:id',
        component: AdminPlatformEditComponent,
      },
      {
        path: 'fifa-games',
        component: AdminFifaGamesComponent,
      },
      {
        path: 'fifa-games/edit/:id',
        component: AdminFifaGameEditComponent,
      },
      {
        path: 'players',
        component: AdminPlayersComponent,
      },
      {
        path: 'players/edit/:id',
        component: AdminPlayerEditComponent,
      },
      {
        path: 'highlights',
        component: AdminHighlightsComponent,
      },
      {
        path: 'seasons',
        component: AdminSeasonsComponent,
      },
      {
        path: 'tournaments',
        component: AdminTournamentsComponent,
      },
      {
        path: 'tournaments/create',
        component: AdminCreateTournamentComponent,
      },
      {
        path: 'tournaments/edit/:id',
        component: AdminEditTournamentComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
