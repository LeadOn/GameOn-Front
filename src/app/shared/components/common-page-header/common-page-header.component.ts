import { Component, Input } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faClock, IconDefinition } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-common-page-header',
  templateUrl: './common-page-header.component.html',
  styleUrl: './common-page-header.component.css',
  standalone: false,
})
export class CommonPageHeaderComponent {
  @Input()
  icon: IconDefinition = faClock;

  @Input()
  title: string = 'Default';

  @Input()
  five = false;

  @Input()
  lol = false;
}
