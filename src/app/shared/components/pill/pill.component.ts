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

      case 'gray':
        this.style = 'bg-gray-600 text-white';
        break;

      case 'yellow':
        this.style = 'bg-yellow-300 text-white';
        break;

      case 'red':
        this.style = 'bg-frenchRed text-white';
        break;

      case 'green':
        this.style = 'bg-customGreen text-white';
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

      case 'gray':
        this.style += ' border border-gray-600';
        break;

      case 'gold':
        this.style += ' border border-yellow-300 border-yellow-300';
        break;

      default:
        break;
    }
  }
}
