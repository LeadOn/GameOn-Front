import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminRoutingModule } from './admin-routing.module';
import { AdminHomeComponent } from './home/admin-home.component';
import { AdminLayoutComponent } from './admin-layout.component';
import { SharedModule } from '../shared/modules/shared.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AdminFifaGamesComponent } from './fifa/games/admin-fifa-games.component';
import { AdminFifaGameEditComponent } from './fifa/games/edit/admin-fifa-game-edit.component';
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

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminHomeComponent,
    AdminFifaHomeComponent,
    AdminPlatformsComponent,
    AdminPlatformEditComponent,
    AdminFifaGamesComponent,
    AdminFifaGameEditComponent,
    AdminPlayersComponent,
    AdminPlayerEditComponent,
    AdminHighlightsComponent,
    AdminSeasonsComponent,
    AdminTournamentsComponent,
    AdminCreateTournamentComponent,
    AdminEditTournamentComponent,
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class AdminModule {}
