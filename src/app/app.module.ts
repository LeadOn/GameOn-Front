import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { KeycloakAngularModule, KeycloakService } from 'keycloak-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/modules/shared.module';
import { CommonLayoutComponent } from './shared/layouts/common-layout.component';
import { HttpClientModule } from '@angular/common/http';
import { HomeComponent } from './home/home.component';
import { HomePlayersComponent } from './home/components/players/home-players.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import { playerReducer } from './store/reducers/player.reducer';
import { ProfilePageComponent } from './players/me/profile.component';
import { ProfileTabComponent } from './players/me/components/profile-tab/profile-tab.component';
import { UpdatePlayerTabComponent } from './players/me/components/update-player-tab/update-player-tab.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FifaHomeComponent } from './fifa/fifa-home.component';
import { FifaGameHistoryCardComponent } from './fifa/components/fifa-game-history-card/fifa-game-history-card.component';
import { FifaGameListHeaderComponent } from './fifa/components/fifa-game-list-header/fifa-game-list-header.component';
import { FifaGameHistoryCardRowComponent } from './fifa/components/fifa-game-history-card/fifa-game-history-card-row/fifa-game-history-card-row.component';
import { FifaCreateGameComponent } from './fifa/create/fifa-create-game.component';
import { FifaGameDetailsComponent } from './fifa/details/fifa-game-details.component';

function initializeKeycloak(keycloak: KeycloakService) {
  return () =>
    keycloak.init({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri:
          window.location.origin + '/assets/silent-check-sso.html',
      },
    });
}

@NgModule({
  declarations: [
    AppComponent,
    CommonLayoutComponent,

    /* Home page */
    HomeComponent,
    HomePlayersComponent,

    /* Player pages */
    ProfilePageComponent,
    ProfileTabComponent,
    UpdatePlayerTabComponent,
    // PlayerDetailsComponent,

    /* FIFA related */
    FifaHomeComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    KeycloakAngularModule,
    SharedModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({
      player: playerReducer,
    }),
    HttpClientModule,
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
