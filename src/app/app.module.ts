import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { HomeComponent } from "./home/home.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { HomePlayersComponent } from "./home/components/players/home-players.component";
import { PlayerCardComponent } from "./shared/components/player-card/player-card.component";
import { HttpClientModule } from "@angular/common/http";
import { GamesPlayedComponent } from "./home/components/games-played/games-played.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PlayerDetailsComponent } from "./players/details/player-details.component";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { environment } from "src/environments/environment";
import { MyDashboardComponent } from "./players/me/my-dashboard.component";
import { PlayerDetailsCardComponent } from "./shared/components/player-details-card/player-details-card.component";
import { UpdatePlayerComponent } from "./players/me/components/update-player/update-player.component";
import { CreateGameComponent } from "./games/create/create-game.component";
import { ArrowBtnComponent } from "./shared/components/arrow-btn/arrow-btn.component";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { GameDetailsComponent } from "./games/details/game-details.component";
import { NotFoundComponent } from "./shared/components/not-found/not-found.component";
import { AdminModule } from "./admin/admin.module";
import { CommonLayoutComponent } from "./shared/layouts/common-layout.component";
import { SharedModule } from "./shared/modules/shared.module";

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
    PlayerCardComponent,
    GamesPlayedComponent,
    PlayerDetailsComponent,
    MyDashboardComponent,
    PlayerDetailsCardComponent,
    UpdatePlayerComponent,
    CreateGameComponent,
    ArrowBtnComponent,
    GameDetailsComponent,
    NotFoundComponent,
    CommonLayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
    KeycloakAngularModule,
    ReactiveFormsModule,
    ClipboardModule,
    AdminModule,
    SharedModule,
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
