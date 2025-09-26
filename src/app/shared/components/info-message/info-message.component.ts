import { Component, Input } from '@angular/core';
import {
  faInfoCircle,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-info-message',
  templateUrl: './info-message.component.html',
  styleUrl: './info-message.component.css',
  standalone: false,
})
export class InfoMessageComponent {
  @Input()
  icon: IconDefinition = faInfoCircle;

  @Input()
  title: string = 'Default';

  @Input()
  type: string = 'info';

  @Input()
  clickable = false;

  @Input()
  applyMargin = true;
}
