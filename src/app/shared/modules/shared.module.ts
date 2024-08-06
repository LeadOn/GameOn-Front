import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from '../layouts/components/footer/footer.component';
import { NotFoundComponent } from '../../components/not-found/not-found.component';
import { ArrowBtnComponent } from '../components/arrow-btn/arrow-btn.component';
import { PlayerCardComponent } from '../components/player-card/player-card.component';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuccessAlertComponent } from '../components/success-alert/success-alert.component';
import { FifaGameHistoryCardComponent } from '../../fifa/components/fifa-game-history-card/fifa-game-history-card.component';
import { FifaGameListHeaderComponent } from '../../fifa/components/fifa-game-list-header/fifa-game-list-header.component';
import { FifaGameHistoryCardRowComponent } from '../../fifa/components/fifa-game-history-card/fifa-game-history-card-row/fifa-game-history-card-row.component';
import { FifaCreateGameComponent } from '../../fifa/create/fifa-create-game.component';
import { FifaGameDetailsComponent } from '../../fifa/details/fifa-game-details.component';
import { FifaStatComponent } from '../components/fifa-stat/fifa-stat.component';

@NgModule({
  declarations: [
    FooterComponent,
    NotFoundComponent,
    ArrowBtnComponent,
    PlayerCardComponent,
    LoadingSpinnerComponent,
    SuccessAlertComponent,
    FifaGameHistoryCardComponent,
    FifaGameListHeaderComponent,
    FifaGameHistoryCardRowComponent,
    FifaCreateGameComponent,
    FifaGameDetailsComponent,
    FifaStatComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    FooterComponent,
    ArrowBtnComponent,
    PlayerCardComponent,
    LoadingSpinnerComponent,
    SuccessAlertComponent,
    FifaGameHistoryCardComponent,
    FifaGameListHeaderComponent,
    FifaGameHistoryCardRowComponent,
    FifaCreateGameComponent,
    FifaGameDetailsComponent,
    FifaStatComponent,
  ],
})
export class SharedModule {}
