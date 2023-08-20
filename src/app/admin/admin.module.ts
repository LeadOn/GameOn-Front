import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminHomeComponent } from "./home/admin-home.component";
import { AdminLayoutComponent } from "./admin-layout.component";
import { AdminPlatformsComponent } from "./platforms/admin-platforms.component";
import { SharedModule } from "../shared/modules/shared.module";
import { AdminPlatformEditComponent } from "./platforms/edit/admin-platform-edit.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { AdminFifaGamesComponent } from "./fifa-games/admin-fifa-games.component";

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminHomeComponent,
    AdminPlatformsComponent,
    AdminPlatformEditComponent,
    AdminFifaGamesComponent,
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
