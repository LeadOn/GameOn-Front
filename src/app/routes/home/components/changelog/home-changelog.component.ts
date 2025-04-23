import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Changelog } from '../../../../shared/classes/common/Changelog';
import { faClock } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-changelog',
  templateUrl: './home-changelog.component.html',
  styleUrl: './home-changelog.component.css',
  standalone: false,
})
export class HomeChangelogComponent implements OnChanges {
  @Input()
  loading: boolean = true;

  @Input()
  changelog?: Changelog;

  @Input()
  error = false;

  updateIcon = faClock;

  ngOnChanges(changes: SimpleChanges): void {
    this.loading =
      changes['loading'] != null
        ? changes['loading'].currentValue
        : this.loading;

    this.changelog =
      changes['changelog'] != null ? changes['changelog'].currentValue : null;

    this.error =
      changes['error'] != null ? changes['error'].currentValue : this.error;
  }
}
