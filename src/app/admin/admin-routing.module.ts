import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminHomeComponent } from "./home/admin-home.component";
import { AuthGuard } from "../shared/guards/auth.guard";
import { AdminLayoutComponent } from "./admin-layout.component";
import { AdminPlatformsComponent } from "./platforms/admin-platforms.component";
import { AdminPlatformEditComponent } from "./platforms/edit/admin-platform-edit.component";
import { AdminFifaGamesComponent } from "./fifa-games/admin-fifa-games.component";
import { AdminFifaGameEditComponent } from "./fifa-games/edit/admin-fifa-game-edit.component";
import { AdminPlayersComponent } from "./players/admin-players.component";
import { AdminHighlightsComponent } from "./highlights/admin-highlights.component";
import { AdminTournamentsComponent } from "./tournaments/admin-tournaments.component";
import { AdminSeasonsComponent } from "./seasons/admin-seasons.component";
import { AdminPlayerEditComponent } from "./players/edit/admin-player-edit.component";

const routes: Routes = [
  {
    path: "",
    component: AdminLayoutComponent,
    canActivate: [AuthGuard],
    data: { roles: ["yugames_admin"] },
    children: [
      {
        path: "",
        component: AdminHomeComponent,
      },
      {
        path: "platforms",
        component: AdminPlatformsComponent,
      },
      {
        path: "platforms/edit/:id",
        component: AdminPlatformEditComponent,
      },
      {
        path: "fifa-games",
        component: AdminFifaGamesComponent,
      },
      {
        path: "fifa-games/edit/:id",
        component: AdminFifaGameEditComponent,
      },
      {
        path: "players",
        component: AdminPlayersComponent,
      },
      {
        path: "players/edit/:id",
        component: AdminPlayerEditComponent,
      },
      {
        path: "highlights",
        component: AdminHighlightsComponent,
      },
      {
        path: "seasons",
        component: AdminSeasonsComponent,
      },
      {
        path: "tournaments",
        component: AdminTournamentsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
