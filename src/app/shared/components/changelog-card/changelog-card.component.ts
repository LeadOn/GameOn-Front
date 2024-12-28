import { Component, Input } from '@angular/core';
import { Changelog } from '../../classes/Changelog';

@Component({
  selector: 'app-changelog-card',
  templateUrl: './changelog-card.component.html',
  styleUrl: './changelog-card.component.scss',
})
export class ChangelogCardComponent {
  @Input()
  changelog: Changelog = new Changelog();
}
