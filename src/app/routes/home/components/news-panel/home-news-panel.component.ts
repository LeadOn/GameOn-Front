import {
  Component,
  Input,
  OnChanges,
  SimpleChanges,
  ChangeDetectionStrategy,
} from '@angular/core';
import { Changelog } from '../../../../shared/classes/common/Changelog';
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-home-news-panel',
  templateUrl: './home-news-panel.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HomeNewsPanelComponent implements OnChanges {
  @Input()
  loading: boolean = true;

  @Input()
  changelog?: Changelog;

  @Input()
  error = false;

  errorIcon = faCircleExclamation;

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
