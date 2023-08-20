import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { PlayerDetailsComponent } from "./players/details/player-details.component";
import { AuthGuard } from "./shared/guards/auth.guard";
import { MyDashboardComponent } from "./players/me/my-dashboard.component";
import { CreateGameComponent } from "./games/create/create-game.component";
import { GameDetailsComponent } from "./games/details/game-details.component";
import { NotFoundComponent } from "./shared/components/not-found/not-found.component";
import { CommonLayoutComponent } from "./shared/layouts/common-layout.component";

const routes: Routes = [
  {
    path: "",
    component: CommonLayoutComponent,
    children: [
      {
        path: "",
        component: HomeComponent,
      },
      {
        path: "home",
        component: HomeComponent,
      },
      {
        path: "player/me",
        component: MyDashboardComponent,
        canActivate: [AuthGuard],
      },
      {
        path: "player/:id",
        component: PlayerDetailsComponent,
      },
      {
        path: "games/create",
        component: CreateGameComponent,
      },
      {
        path: "games/:id",
        component: GameDetailsComponent,
      },
    ],
  },
  {
    path: "admin",
    loadChildren: () =>
      import("./admin/admin.module").then((m) => m.AdminModule),
  },
  {
    path: "**",
    component: CommonLayoutComponent,
    children: [
      {
        path: "**",
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
