import { Component, Input, OnInit } from '@angular/core';
import {
  faExternalLink,
  IconDefinition,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-pill',
  templateUrl: './pill.component.html',
  styleUrl: './pill.component.scss',
})
export class PillComponent implements OnInit {
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

  @Input()
  bgStyle = 'primary';

  @Input()
  borderStyle?: string;

  style = '';

  externalIcon = faExternalLink;

  ngOnInit(): void {
    this.style = 'bg-bgLight text-primary dark:bg-bgDark dark:text-primaryDark';

    this.buildBgStyle(this.bgStyle);

    if (this.borderStyle) {
      this.buildBorderStyle(this.borderStyle);
    }
  }

  buildBgStyle(bgStyle: string) {
    switch (bgStyle) {
      case 'primary':
        this.style =
          'bg-bgLight text-primary dark:bg-bgDark dark:text-primaryDark';
        break;

      case 'primary-dark':
        this.style =
          'bg-bgLightDarker text-primary dark:bg-bgDarkDarker dark:text-primaryDark';
        break;

      case 'secondary':
        this.style = 'bg-secondary text-primaryDark';
        break;

      default:
        this.style =
          'bg-bgLight text-primary dark:bg-bgDark dark:text-primaryDark';
        break;
    }
  }

  buildBorderStyle(borderStyle: string) {
    switch (borderStyle) {
      case 'primary':
        this.style += ' border border-primary dark:border-primaryDark';
        break;

      case 'red':
        this.style += ' border border-frenchRed';
        break;

      default:
        break;
    }
  }
}
