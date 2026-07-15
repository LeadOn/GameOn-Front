import { NgModule, LOCALE_ID } from '@angular/core';
import { registerLocaleData } from '@angular/common';
import localeFr from '@angular/common/locales/fr';
import { BrowserModule } from '@angular/platform-browser';
import {
  AutoRefreshTokenService,
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  includeBearerTokenInterceptor,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken,
} from 'keycloak-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/modules/shared.module';
import { CommonLayoutComponent } from './shared/layouts/common-layout.component';
import {
  provideHttpClient,
  withInterceptors,
  withXhr,
} from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { AdminModule } from './admin/admin.module';
import { ChangelogComponent } from './routes/changelog/changelog.component';
import {
  playerReducer,
  playerStatsReducer,
} from './core/store/reducers/player.reducer';
import { HomeComponent } from './routes/home/home.component';
import { HomeHeaderComponent } from './routes/home/components/header/home-header.component';
import { HomeTournamentBannerComponent } from './routes/home/components/tournament-banner/home-tournament-banner.component';
import { HomeFifaStatsComponent } from './routes/home/components/fifa-stats/home-fifa-stats.component';
import { HomeMatchesListComponent } from './routes/home/components/matches-list/home-matches-list.component';
import { HomeNewsPanelComponent } from './routes/home/components/news-panel/home-news-panel.component';
import { HomeLolLeaderboardComponent } from './routes/home/components/lol-leaderboard/home-lol-leaderboard.component';
import { HomeLolSeasonCardComponent } from './routes/home/components/lol-season-card/home-lol-season-card.component';
import { ProfilePageComponent } from './routes/profile/profile.component';
import { lolVersionReducer } from './core/store/reducers/lol.reducer';
import { readStoredKeycloakTokens } from './core/keycloak/keycloak-offline-tokens';

registerLocaleData(localeFr);

const storedKeycloakTokens = readStoredKeycloakTokens();

const devCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(http:\/\/localhost:5184)(\/.*)?$/i,
  bearerPrefix: 'Bearer',
});

const prodCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(https:\/\/gameon-api.valentinvirot.fr)(\/.*)?$/i,
  bearerPrefix: 'Bearer',
});

@NgModule({
  declarations: [
    AppComponent,
    CommonLayoutComponent,
    HomeComponent,
    ProfilePageComponent,
    ChangelogComponent,
    HomeHeaderComponent,
    HomeTournamentBannerComponent,
    HomeFifaStatsComponent,
    HomeMatchesListComponent,
    HomeNewsPanelComponent,
    HomeLolLeaderboardComponent,
    HomeLolSeasonCardComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    SharedModule,
    FontAwesomeModule,
    BrowserAnimationsModule,
    StoreModule.forRoot({
      player: playerReducer,
      globalStats: playerStatsReducer,
      lolVersion: lolVersionReducer,
    }),
    ClipboardModule,
    AdminModule,
  ],
  providers: [
    provideKeycloak({
      config: {
        url: environment.keycloak.url,
        realm: environment.keycloak.realm,
        clientId: environment.keycloak.clientId,
      },
      initOptions: {
        onLoad: 'check-sso',
        silentCheckSsoRedirectUri: `${window.location.origin}/assets/silent-check-sso.html`,
        // Disabled so a restored offline refresh token (see below) is used
        // via a direct token-endpoint refresh instead of being silently
        // dropped when the browser's SSO session cookie is stale/gone.
        checkLoginIframe: false,
        scope: 'offline_access',
        ...storedKeycloakTokens,
      },
      features: [
        withAutoRefreshToken({
          sessionTimeout: 30 * 60 * 1000,
          onInactivityTimeout: 'login',
        }),
      ],
      providers: [AutoRefreshTokenService, UserActivityService],
    }),
    { provide: LOCALE_ID, useValue: 'fr' },
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [devCondition, prodCondition],
    },
    provideHttpClient(
      withXhr(),
      withInterceptors([includeBearerTokenInterceptor]),
    ),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
