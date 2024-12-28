import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { faExternalLink } from '@fortawesome/free-solid-svg-icons';
import { Changelog } from '../../../shared/classes/common/Changelog';

@Component({
  selector: 'app-home-changelog',
  templateUrl: './home-changelog.component.html',
  styleUrl: './home-changelog.component.scss',
})
export class HomeChangelogComponent implements OnChanges {
  @Input()
  loading: boolean = true;

  @Input()
  changelog?: Changelog;

  externalIcon = faExternalLink;

  ngOnChanges(changes: SimpleChanges): void {
    console.log('Changes detected', changes);
    this.loading = changes['loading'].currentValue;
    this.changelog = changes['changelog'].currentValue;
  }
}
