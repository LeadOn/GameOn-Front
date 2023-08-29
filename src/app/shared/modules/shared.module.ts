import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingSpinnerComponent } from "../components/loading-spinner/loading-spinner.component";
import { PlayerCardComponent } from "../components/player-card/player-card.component";
import { RouterModule } from "@angular/router";
import { NotFoundComponent } from "../components/not-found/not-found.component";
import { ArrowBtnComponent } from "../components/arrow-btn/arrow-btn.component";
import { FifaGameHistoryCardRowComponent } from "src/app/fifa/components/fifa-game-history-card/fifa-game-history-card-row/fifa-game-history-card-row.component";
import { FifaGameHistoryCardComponent } from "src/app/fifa/components/fifa-game-history-card/fifa-game-history-card.component";
import { FontAwesomeModule } from "@fortawesome/angular-fontawesome";
import { FifaGameListHeaderComponent } from "src/app/fifa/components/fifa-game-list-header/fifa-game-list-header.component";
import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { FooterComponent } from "../layouts/components/footer/footer.component";
import { FifaCreateGameComponent } from "src/app/fifa/create/fifa-create-game.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FifaGameDetailsComponent } from "src/app/fifa/details/fifa-game-details.component";
import { FifaStatComponent } from "../components/fifa-stat/fifa-stat.component";
import { FifaHistoryComponent } from "src/app/fifa/history/fifa-history.component";
import { SuccessAlertComponent } from "../components/success-alert/success-alert.component";

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    ArrowBtnComponent,
    FifaGameListHeaderComponent,
    FifaGameHistoryCardComponent,
    FifaGameHistoryCardRowComponent,
    FifaCreateGameComponent,
    FifaGameDetailsComponent,
    PlayerCardComponent,
    NotFoundComponent,
    FooterComponent,
    FifaStatComponent,
    FifaHistoryComponent,
    SuccessAlertComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    LoadingSpinnerComponent,
    FifaGameListHeaderComponent,
    FifaGameHistoryCardComponent,
    FifaGameHistoryCardRowComponent,
    PlayerCardComponent,
    NotFoundComponent,
    ArrowBtnComponent,
    FooterComponent,
    FontAwesomeModule,
    FifaCreateGameComponent,
    FormsModule,
    ReactiveFormsModule,
    FifaGameDetailsComponent,
    FifaStatComponent,
    FifaHistoryComponent,
    SuccessAlertComponent,
  ],
})
export class SharedModule {}
