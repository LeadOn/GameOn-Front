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
import { AdminFifaGameEditComponent } from "./fifa-games/edit/admin-fifa-game-edit.component";
import { AdminPlayersComponent } from "./players/admin-players.component";
import { AdminHighlightsComponent } from "./highlights/admin-highlights.component";

@NgModule({
  declarations: [
    AdminLayoutComponent,
    AdminHomeComponent,
    AdminPlatformsComponent,
    AdminPlatformEditComponent,
    AdminFifaGamesComponent,
    AdminFifaGameEditComponent,
    AdminPlayersComponent,
    AdminHighlightsComponent,
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
