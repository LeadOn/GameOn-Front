import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { AdminHomeComponent } from "./home/admin-home.component";
import { AuthGuard } from "../shared/guards/auth.guard";
import { AdminLayoutComponent } from "./admin-layout.component";

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
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
