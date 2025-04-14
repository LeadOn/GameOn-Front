import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminHomeComponent } from './home/admin-home.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { AdminFifaGamesComponent } from './fifa/games/admin-fifa-games.component';
import { AdminFifaGameEditComponent } from './fifa/games/edit/admin-fifa-game-edit.component';
import { canActivateAuthRole } from '../core/guards/auth.guard';
import { AdminFifaHomeComponent } from './fifa/admin-fifa-home.component';
import { AdminHighlightsComponent } from './fifa/highlights/admin-highlights.component';
import { AdminTournamentsComponent } from './fifa/tournaments/admin-tournaments.component';
import { AdminCreateTournamentComponent } from './fifa/tournaments/create/admin-create-tournament.component';
import { AdminEditTournamentComponent } from './fifa/tournaments/edit/admin-edit-tournament.component';
import { AdminSeasonsComponent } from './general/seasons/admin-seasons.component';
import { AdminPlatformsComponent } from './general/platforms/admin-platforms.component';
import { AdminPlatformEditComponent } from './general/platforms/edit/admin-platform-edit.component';
import { AdminPlayersComponent } from './general/players/admin-players.component';
import { AdminPlayerEditComponent } from './general/players/edit/admin-player-edit.component';

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
        path: 'fifa',
        component: AdminFifaHomeComponent,
      },
      {
        path: 'fifa/games',
        component: AdminFifaGamesComponent,
      },
      {
        path: 'fifa/games/edit/:id',
        component: AdminFifaGameEditComponent,
      },
      {
        path: 'fifa/highlights',
        component: AdminHighlightsComponent,
      },
      {
        path: 'fifa/tournaments',
        component: AdminTournamentsComponent,
      },
      {
        path: 'fifa/tournaments/create',
        component: AdminCreateTournamentComponent,
      },
      {
        path: 'fifa/tournaments/edit/:id',
        component: AdminEditTournamentComponent,
      },
      {
        path: 'general/seasons',
        component: AdminSeasonsComponent,
      },
      {
        path: 'general/platforms',
        component: AdminPlatformsComponent,
      },
      {
        path: 'general/platforms/edit/:id',
        component: AdminPlatformEditComponent,
      },
      {
        path: 'general/players',
        component: AdminPlayersComponent,
      },
      {
        path: 'general/players/edit/:id',
        component: AdminPlayerEditComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
