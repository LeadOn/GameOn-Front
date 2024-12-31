import { Component } from '@angular/core';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-home-lol',
    templateUrl: './home-lol.component.html',
    styleUrl: './home-lol.component.scss',
    standalone: false
})
export class HomeLolComponent {
  externalIcon = faExternalLink;
}
