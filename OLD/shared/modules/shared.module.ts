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
import { FooterComponent } from "../layouts/components/footer/footer.component";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { FifaStatComponent } from "../components/fifa-stat/fifa-stat.component";
import { SuccessAlertComponent } from "../components/success-alert/success-alert.component";
import { PlayerTeamListComponent } from "../components/player-team-list/player-team-list.component";
import { NgChartsModule } from "ng2-charts";
import { Chart } from "chart.js";

Chart.defaults.color = "#fff";

@NgModule({
  declarations: [
    ArrowBtnComponent,
    LoadingSpinnerComponent,
    NotFoundComponent,
    FooterComponent,
    SuccessAlertComponent,
    PlayerCardComponent,
    PlayerTeamListComponent,
    FifaStatComponent,
    FifaGameListHeaderComponent,
    FifaGameHistoryCardComponent,
    FifaGameHistoryCardRowComponent,
  ],
  imports: [
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
  ],
  exports: [
    ArrowBtnComponent,
    LoadingSpinnerComponent,
    NotFoundComponent,
    FooterComponent,
    SuccessAlertComponent,
    PlayerCardComponent,
    PlayerTeamListComponent,
    FifaStatComponent,
    FifaGameListHeaderComponent,
    FifaGameHistoryCardComponent,
    FifaGameHistoryCardRowComponent,
    CommonModule,
    RouterModule,
    FontAwesomeModule,
    FormsModule,
    ReactiveFormsModule,
    NgChartsModule,
  ],
})
export class SharedModule {}
