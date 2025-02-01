import { Component, Input } from '@angular/core';
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';

@Component({
  selector: 'app-info-message',
  templateUrl: './info-message.component.html',
  styleUrl: './info-message.component.scss',
  standalone: false,
})
export class InfoMessageComponent {
  @Input()
  icon: IconProp = faInfoCircle;

  @Input()
  title: string = 'Default';

  @Input()
  type: string = 'info';

  @Input()
  clickable = false;

  @Input()
  applyMargin = true;
}
