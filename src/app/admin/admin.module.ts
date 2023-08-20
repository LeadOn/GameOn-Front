import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminHomeComponent } from "./home/admin-home.component";
import { AdminLayoutComponent } from "./admin-layout.component";
import { AdminPlatformsComponent } from "./platforms/admin-platforms.component";

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminHomeComponent,
    AdminPlatformsComponent,
  ],
  imports: [CommonModule, AdminRoutingModule],
})
export class AdminModule {}
