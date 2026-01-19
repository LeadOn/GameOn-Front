import { Component, Input } from '@angular/core';
import { AthleteDto } from '../../shared/classes/AthleteDto';

@Component({
  selector: 'app-pinned-athlete-card',
  standalone: false,
  templateUrl: './pinned-athlete-card.component.html',
  styleUrl: './pinned-athlete-card.component.css',
})
export class PinnedAthleteCardComponent {
  @Input() athlete!: AthleteDto;
  @Input() isLink: boolean = true;

  getImagePath(): string {
    if (this.athlete.id === 4210) {
      return 'assets/img/halterodata-poc/gregoire-aubertin.jpg';
    } else if (this.athlete.id === 1) {
      return 'assets/img/halterodata-poc/bastien-bonnamant.png';
    }
    return '';
  }

  getImageAlt(): string {
    return this.athlete.fullName;
  }
}
