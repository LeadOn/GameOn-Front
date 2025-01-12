import { Component } from '@angular/core';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-home-lol',
  templateUrl: './home-lol.component.html',
  styleUrl: './home-lol.component.scss',
  standalone: false,
})
export class HomeLolComponent {
  lolVersion = environment.currentLoLPatch;
  externalIcon = faExternalLink;
}
