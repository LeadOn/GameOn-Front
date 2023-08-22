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

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    FifaGameListHeaderComponent,
    FifaGameHistoryCardComponent,
    FifaGameHistoryCardRowComponent,
    PlayerCardComponent,
    NotFoundComponent,
    ArrowBtnComponent,
  ],
  imports: [CommonModule, RouterModule, FontAwesomeModule],
  exports: [
    LoadingSpinnerComponent,
    FifaGameListHeaderComponent,
    FifaGameHistoryCardComponent,
    FifaGameHistoryCardRowComponent,
    PlayerCardComponent,
    NotFoundComponent,
    ArrowBtnComponent,
    FontAwesomeModule,
  ],
})
export class SharedModule {}
