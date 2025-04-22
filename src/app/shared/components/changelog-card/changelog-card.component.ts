import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Changelog } from '../../classes/common/Changelog';

@Component({
  selector: 'app-changelog-card',
  templateUrl: './changelog-card.component.html',
  styleUrl: './changelog-card.component.css',
  standalone: false,
})
export class ChangelogCardComponent implements OnChanges {
  @Input()
  changelog?: Changelog;

  @Input()
  loading = false;

  ngOnChanges(changes: SimpleChanges): void {
    this.loading = changes['loading'].currentValue;
    this.changelog = changes['changelog'].currentValue;
  }
}
