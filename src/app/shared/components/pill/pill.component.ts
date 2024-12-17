import { Component, Input } from '@angular/core';
import {
  faExternalLink,
  faInfoCircle,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pill',
  templateUrl: './pill.component.html',
  styleUrl: './pill.component.scss',
})
export class PillComponent {
  @Input()
  title: string = 'Pill title';

  @Input()
  icon?: IconDefinition;

  @Input()
  iconPulsate = false;

  @Input()
  showExternalIcon = false;

  @Input()
  iconColor = 'text-primary';

  externalIcon = faExternalLink;
}
