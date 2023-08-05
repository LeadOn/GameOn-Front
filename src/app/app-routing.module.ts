import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { PlayerDetailsComponent } from "./players/details/player-details.component";
import { AuthGuard } from "./guard/auth.guard";
import { MyDashboardComponent } from "./players/me/my-dashboard.component";

const routes: Routes = [
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
    path: "**",
    component: HomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
