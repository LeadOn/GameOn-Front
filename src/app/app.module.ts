import { APP_INITIALIZER, NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { HomeComponent } from "./home/home.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { HomePlayersComponent } from "./home/components/players/home-players.component";
import { PlayerCardComponent } from "./shared/player/card/player-card.component";
import { HttpClientModule } from "@angular/common/http";
import { GamesPlayedComponent } from "./home/components/games-played/games-played.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { PlayerDetailsComponent } from "./players/details/player-details.component";
import { KeycloakAngularModule, KeycloakService } from "keycloak-angular";
import { environment } from "src/environments/environment";
import { MyDashboardComponent } from "./players/me/my-dashboard.component";
import { PlayerDetailsCardComponent } from "./shared/player/details-card/player-details-card.component";
import { UpdatePlayerComponent } from "./players/me/components/update-player/update-player.component";
import { CreateGameComponent } from "./games/create/create-game.component";
import { ArrowBtnComponent } from "./shared/arrow-btn/arrow-btn.component";
import { LoadingSpinnerComponent } from "./shared/loading-spinner/loading-spinner.component";
import { ClipboardModule } from "@angular/cdk/clipboard";
import { GamePlayedCardRowComponent } from "./shared/game-played-card-row/game-played-card-row.component";

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
    NavbarComponent,
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
    LoadingSpinnerComponent,
    GamePlayedCardRowComponent,
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
