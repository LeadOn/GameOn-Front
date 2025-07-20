import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ArrowBtnComponent } from '../components/arrow-btn/arrow-btn.component';
import { PlayerCardComponent } from '../components/player-card/player-card.component';
import { LoadingSpinnerComponent } from '../components/loading-spinner/loading-spinner.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SuccessAlertComponent } from '../components/success-alert/success-alert.component';
import { FifaStatComponent } from '../components/fifa-stat/fifa-stat.component';
import { PlayerTeamListComponent } from '../components/player-team-list/player-team-list.component';
import { CommonPageHeaderComponent } from '../components/common-page-header/common-page-header.component';
import { InfoMessageComponent } from '../components/info-message/info-message.component';
import { PillComponent } from '../components/pill/pill.component';
import { LoadingSpinnerTinyComponent } from '../components/loading-spinner-tiny/loading-spinner-tiny.component';
import { ChangelogCardComponent } from '../components/changelog-card/changelog-card.component';
import { SafePipe } from '../../core/pipes/safe.pipe';
import { FifaGameHistoryCardComponent } from '../../routes/fifa/components/fifa-game-history-card/fifa-game-history-card.component';

@NgModule({
  declarations: [
    /* Pipes */
    SafePipe,

    /* FIFA related components */
    FifaGameHistoryCardComponent,
    FifaStatComponent,

    /* Components */
    ArrowBtnComponent,
    PlayerCardComponent,
    LoadingSpinnerComponent,
    SuccessAlertComponent,
    PlayerTeamListComponent,
    CommonPageHeaderComponent,
    InfoMessageComponent,
    PillComponent,
    LoadingSpinnerTinyComponent,
    ChangelogCardComponent,
  ],
  imports: [
    CommonModule,
    FontAwesomeModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [
    /* Modules */
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    FontAwesomeModule,

    /* Pipes */
    SafePipe,

    /* FIFA related components */
    FifaGameHistoryCardComponent,
    FifaStatComponent,

    /* Other components */
    ArrowBtnComponent,
    PlayerCardComponent,
    LoadingSpinnerComponent,
    SuccessAlertComponent,
    PlayerTeamListComponent,
    CommonPageHeaderComponent,
    InfoMessageComponent,
    PillComponent,
    LoadingSpinnerTinyComponent,
    ChangelogCardComponent,
  ],
})
export class SharedModule {}
