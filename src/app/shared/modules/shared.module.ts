import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { LoadingSpinnerComponent } from "../components/loading-spinner/loading-spinner.component";
import { GamePlayedCardRowComponent } from "../components/game-played-card-row/game-played-card-row.component";

@NgModule({
  declarations: [LoadingSpinnerComponent, GamePlayedCardRowComponent],
  imports: [CommonModule],
  exports: [LoadingSpinnerComponent, GamePlayedCardRowComponent],
})
export class SharedModule {}
