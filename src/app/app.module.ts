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
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';
import {
  playerReducer,
  playerStatsReducer,
} from './store/reducers/player.reducer';
import { ProfilePageComponent } from './players/me/profile.component';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { FifaHomeComponent } from './fifa/fifa-home.component';
import { TournamentsHomeComponent } from './fifa/tournaments/tournaments-home.component';
import { TournamentsDetailsComponent } from './fifa/tournaments/details/tournaments-details.component';
import { SafePipe } from './shared/pipes/safe.pipe';
import { PlayerDetailsComponent } from './players/details/player-details.component';
import { AdminModule } from './admin/admin.module';
import { ChangelogComponent } from './changelog/changelog.component';
import { FiveComponent } from './five/five.component';
import { CreateFiveComponent } from './five/create/five-create.component';
import { FiveDetailsComponent } from './five/details/five-details.component';

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
    HomeComponent,
    ProfilePageComponent,
    PlayerDetailsComponent,
    FifaHomeComponent,
    TournamentsHomeComponent,
    TournamentsDetailsComponent,
    FiveComponent,
    CreateFiveComponent,
    FiveDetailsComponent,
    SafePipe,
    ChangelogComponent,
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
      globalStats: playerStatsReducer,
    }),
    HttpClientModule,
    ClipboardModule,
    AdminModule,
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
