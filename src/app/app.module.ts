import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";

import { AppRoutingModule } from "./app-routing.module";
import { AppComponent } from "./app.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { HomeComponent } from "./home/home.component";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { HomePlayersComponent } from "./home/components/players/home-players.component";
import { PlayerCardComponent } from "./home/components/player-card/player-card.component";
import { HttpClientModule } from "@angular/common/http";
import { GamesPlayedComponent } from "./home/components/games-played/games-played.component";
import { FormsModule } from "@angular/forms";
import { PlayerDetailsComponent } from "./home/components/players/details/player-details.component";

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
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    FormsModule,
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
