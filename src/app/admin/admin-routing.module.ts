import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminHomeComponent } from "./home/admin-home.component";
import { AuthGuard } from "../shared/guards/auth.guard";
import { AdminLayoutComponent } from "./admin-layout.component";
import { AdminPlatformsComponent } from "./platforms/admin-platforms.component";
import { AdminPlatformEditComponent } from "./platforms/edit/admin-platform-edit.component";
import { AdminFifaGamesComponent } from "./fifa-games/admin-fifa-games.component";

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
