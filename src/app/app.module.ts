import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import {
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  includeBearerTokenInterceptor,
  provideKeycloak,
} from 'keycloak-angular';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { environment } from '../environments/environment';
import { SharedModule } from './shared/modules/shared.module';
import { CommonLayoutComponent } from './shared/layouts/common-layout.component';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreModule } from '@ngrx/store';

import { ClipboardModule } from '@angular/cdk/clipboard';
import { AdminModule } from './admin/admin.module';
import { DonateComponent } from './routes/donate/donate.component';
import { LolPlayerDetailsComponent } from './lol/player/lol-player-details.component';
import { RankHistoryComponent } from './lol/player/components/rank-history/rank-history.component';
import { WinRateChartComponent } from './lol/player/components/win-rate-chart/win-rate-chart.component';
import { LolGameDetailsComponent } from './lol/games/details/lol-game-details.component';
import { LolGameCardComponent } from './lol/components/lol-game-card/lol-game-card.component';
import { LolGameDetailsPlayerComponent } from './lol/components/lol-game-details-player/lol-game-details-player.component';
import { ChangelogComponent } from './routes/changelog/changelog.component';
import {
  playerReducer,
  playerStatsReducer,
} from './core/store/reducers/player.reducer';
import { HomeComponent } from './routes/home/home.component';
import { HomeChangelogComponent } from './routes/home/components/changelog/home-changelog.component';
import { HomeFifaComponent } from './routes/home/components/fifa/home-fifa.component';
import { HomeLolComponent } from './routes/home/components/lol/home-lol.component';
import { ProfilePageComponent } from './routes/profile/profile.component';
import { LolOldGameDetailsPlayerGraphComponent } from './lol/components/lol-old-game-details-player-graph/lol-old-game-details-player-graph.component';

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
    DonateComponent,
    LolPlayerDetailsComponent,
    RankHistoryComponent,
    WinRateChartComponent,
    LolGameDetailsComponent,
    HomeChangelogComponent,
    HomeFifaComponent,
    HomeLolComponent,
    LolGameCardComponent,
    LolGameDetailsPlayerComponent,
    LolOldGameDetailsPlayerGraphComponent,
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
      },
    }),
    {
      provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
      useValue: [devCondition, prodCondition],
    },
    provideHttpClient(withInterceptors([includeBearerTokenInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
