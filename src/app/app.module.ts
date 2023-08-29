import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { environment } from "src/environments/environment";
import { ClipboardModule } from "@angular/cdk/clipboard";

import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { StoreModule } from "@ngrx/store";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { HomePlayersComponent } from "./home/components/players/home-players.component";
import { PlayerDetailsComponent } from "./players/details/player-details.component";
import { MyDashboardComponent } from "./players/me/my-dashboard.component";
import { UpdatePlayerTabComponent } from "./players/me/components/update-player-tab/update-player-tab.component";
import { AdminModule } from "./admin/admin.module";
import { CommonLayoutComponent } from "./shared/layouts/common-layout.component";
import { SharedModule } from "./shared/modules/shared.module";
import { playerReducer } from "./store/reducers/player.reducer";
import { NgChartsModule } from "ng2-charts";
import { Chart } from "chart.js";
import { PlayerTeamListComponent } from "./shared/components/player-team-list/player-team-list.component";
import { ProfileTabComponent } from "./players/me/components/profile-tab/profile-tab.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

Chart.defaults.color = "#fff";

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        onLoad: "check-sso",
        silentCheckSsoRedirectUri:
          window.location.origin + "/assets/silent-check-sso.html",
      },
    });
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CommonLayoutComponent,
    HomePlayersComponent,
    PlayerDetailsComponent,
    PlayerTeamListComponent,
    UpdatePlayerTabComponent,
    MyDashboardComponent,
    ProfileTabComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    KeycloakAngularModule,
    ClipboardModule,
    AdminModule,
    SharedModule,
    StoreModule.forRoot({
      player: playerReducer,
    }),
    NgChartsModule,
    BrowserAnimationsModule,
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializeKeycloak,
      multi: true,
      deps: [KeycloakService],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
