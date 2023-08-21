import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingSpinnerComponent } from "../components/loading-spinner/loading-spinner.component";
import { GamePlayedCardRowComponent } from "../components/game-played-card-row/game-played-card-row.component";
import { PlayerCardComponent } from "../components/player-card/player-card.component";
import { RouterModule } from "@angular/router";
import { NotFoundComponent } from "../components/not-found/not-found.component";
import { ArrowBtnComponent } from "../components/arrow-btn/arrow-btn.component";

@NgModule({
  declarations: [
    LoadingSpinnerComponent,
    GamePlayedCardRowComponent,
    PlayerCardComponent,
    NotFoundComponent,
    ArrowBtnComponent,
  ],
  imports: [CommonModule, RouterModule],
  exports: [
    LoadingSpinnerComponent,
    GamePlayedCardRowComponent,
    PlayerCardComponent,
    NotFoundComponent,
    ArrowBtnComponent,
  ],
})
export class SharedModule {}
