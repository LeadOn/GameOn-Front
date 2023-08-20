import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { AdminRoutingModule } from "./admin-routing.module";
import { AdminHomeComponent } from "./home/admin-home.component";
import { AdminLayoutComponent } from "./admin-layout.component";

@NgModule({
  declarations: [AdminLayoutComponent, AdminHomeComponent],
  imports: [CommonModule, AdminRoutingModule],
})
export class AdminModule {}
