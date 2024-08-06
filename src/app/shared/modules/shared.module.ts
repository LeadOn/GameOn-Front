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

@NgModule({
  declarations: [
    FooterComponent,
    NotFoundComponent,
    ArrowBtnComponent,
    PlayerCardComponent,
    LoadingSpinnerComponent,
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
  ],
})
export class SharedModule {}
