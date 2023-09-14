import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";

import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { StoreModule } from "@ngrx/store";

import { environment } from "src/environments/environment";
import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { SharedModule } from "./shared/modules/shared.module";
import { AdminModule } from "./admin/admin.module";
import { playerReducer } from "./store/reducers/player.reducer";
import { CommonLayoutComponent } from "./shared/layouts/common-layout.component";

import { HomeComponent } from "./home/home.component";
import { HomePlayersComponent } from "./home/components/players/home-players.component";

import { ProfilePageComponent } from "./players/me/profile.component";
import { UpdatePlayerTabComponent } from "./players/me/components/update-player-tab/update-player-tab.component";
import { ProfileTabComponent } from "./players/me/components/profile-tab/profile-tab.component";

import { PlayerDetailsComponent } from "./players/details/player-details.component";
import { FifaCreateGameComponent } from "./fifa/create/fifa-create-game.component";
import { FifaGameDetailsComponent } from "./fifa/details/fifa-game-details.component";
import { FifaHistoryComponent } from "./fifa/history/fifa-history.component";
import { TournamentsHomeComponent } from "./tournaments/tournaments-home.component";

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
    /* Global */
    AppComponent,
    CommonLayoutComponent,

    /* Home page */
    HomeComponent,
    HomePlayersComponent,

    /* Player details */
    PlayerDetailsComponent,
    FifaHistoryComponent,
    FifaCreateGameComponent,
    FifaGameDetailsComponent,

    /* Profile page */
    ProfilePageComponent,
    ProfileTabComponent,
    UpdatePlayerTabComponent,
    TournamentsHomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    BrowserAnimationsModule,
    ClipboardModule,
    KeycloakAngularModule,
    AdminModule,
    SharedModule,
    StoreModule.forRoot({
      player: playerReducer,
    }),
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
