import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { environment } from "src/environments/environment";
import { ClipboardModule } from "@angular/cdk/clipboard";

import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { StoreModule } from "@ngrx/store";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { HomeComponent } from "./home/home.component";
import { FooterComponent } from "./shared/layouts/components/footer/footer.component";
import { HomePlayersComponent } from "./home/components/players/home-players.component";
import { PlayerDetailsComponent } from "./players/details/player-details.component";
import { MyDashboardComponent } from "./players/me/my-dashboard.component";
import { UpdatePlayerComponent } from "./players/me/components/update-player/update-player.component";
import { AdminModule } from "./admin/admin.module";
import { CommonLayoutComponent } from "./shared/layouts/common-layout.component";
import { SharedModule } from "./shared/modules/shared.module";
import { playerReducer } from "./store/reducers/player.reducer";
import { FifaStatComponent } from "./shared/components/fifa-stat/fifa-stat.component";
import { PlayerDetailsCardComponent } from "./players/me/components/player-details-card/player-details-card.component";
import { FifaHistoryComponent } from "./fifa/history/fifa-history.component";
import { FifaCreateGameComponent } from "./fifa/create/fifa-create-game.component";
import { FifaGameDetailsComponent } from "./fifa/details/fifa-game-details.component";
import { NgChartsModule } from "ng2-charts";
import { Chart } from "chart.js";

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
    FooterComponent,
    HomePlayersComponent,
    PlayerDetailsComponent,
    MyDashboardComponent,
    PlayerDetailsCardComponent,
    UpdatePlayerComponent,
    FifaCreateGameComponent,
    FifaGameDetailsComponent,
    CommonLayoutComponent,
    FifaStatComponent,
    FifaHistoryComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    KeycloakAngularModule,
    ReactiveFormsModule,
    ClipboardModule,
    AdminModule,
    SharedModule,
    StoreModule.forRoot({
      player: playerReducer,
    }),
    NgChartsModule,
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
