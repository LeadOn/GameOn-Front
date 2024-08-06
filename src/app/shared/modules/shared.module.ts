import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { FooterComponent } from '../layouts/components/footer/footer.component';
import { NotFoundComponent } from '../../components/not-found/not-found.component';

@NgModule({
  declarations: [FooterComponent, NotFoundComponent],
  imports: [CommonModule, FontAwesomeModule],
  exports: [FontAwesomeModule, FooterComponent],
})
export class SharedModule {}
