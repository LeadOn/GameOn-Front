import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { HomeComponent } from "./home/home.component";
import { PlayerDetailsComponent } from "./home/components/players/details/player-details.component";
import { AuthGuard } from "./guard/auth.guard";

const routes: Routes = [
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
