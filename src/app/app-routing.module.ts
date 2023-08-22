import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { PlayerDetailsComponent } from "./players/details/player-details.component";
import { AuthGuard } from "./shared/guards/auth.guard";
import { MyDashboardComponent } from "./players/me/my-dashboard.component";
import { NotFoundComponent } from "./shared/components/not-found/not-found.component";
import { CommonLayoutComponent } from "./shared/layouts/common-layout.component";
import { FifaHistoryComponent } from "./fifa/history/fifa-history.component";
import { FifaCreateGameComponent } from "./fifa/create/fifa-create-game.component";
import { FifaGameDetailsComponent } from "./fifa/details/fifa-game-details.component";

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
        path: "fifa/history",
        component: FifaHistoryComponent,
      },
      {
        path: "fifa/create",
        component: FifaCreateGameComponent,
      },
      {
        path: "fifa/details/:id",
        component: FifaGameDetailsComponent,
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
