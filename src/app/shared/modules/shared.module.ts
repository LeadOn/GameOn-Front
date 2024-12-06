import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NotFoundComponent } from '../../components/not-found/not-found.component';
import { ArrowBtnComponent } from '../components/arrow-btn/arrow-btn.component';
import { PlayerCardComponent } from '../components/player-card/player-card.component';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuccessAlertComponent } from '../components/success-alert/success-alert.component';
import { FifaGameHistoryCardComponent } from '../../fifa/components/fifa-game-history-card/fifa-game-history-card.component';
import { FifaCreateGameComponent } from '../../fifa/create/fifa-create-game.component';
import { FifaGameDetailsComponent } from '../../fifa/details/fifa-game-details.component';
import { FifaStatComponent } from '../components/fifa-stat/fifa-stat.component';
import { PlayerTeamListComponent } from '../components/player-team-list/player-team-list.component';
import { CommonPageHeaderComponent } from '../components/common-page-header/common-page-header.component';

@NgModule({
  declarations: [
    NotFoundComponent,
    ArrowBtnComponent,
    PlayerCardComponent,
    LoadingSpinnerComponent,
    SuccessAlertComponent,
    FifaGameHistoryCardComponent,
    FifaCreateGameComponent,
    FifaGameDetailsComponent,
    FifaStatComponent,
    PlayerTeamListComponent,
    CommonPageHeaderComponent,
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
    ArrowBtnComponent,
    PlayerCardComponent,
    LoadingSpinnerComponent,
    SuccessAlertComponent,
    FifaGameHistoryCardComponent,
    FifaCreateGameComponent,
    FifaGameDetailsComponent,
    FifaStatComponent,
    PlayerTeamListComponent,
    CommonPageHeaderComponent,
  ],
})
export class SharedModule {}
