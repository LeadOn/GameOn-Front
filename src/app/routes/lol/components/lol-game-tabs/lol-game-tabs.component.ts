import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  Output,
} from '@angular/core';
import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface GameTab {
  id: string;
  label: string;
  icon: IconDefinition;
}

@Component({
  selector: 'app-lol-game-tabs',
  standalone: false,
  templateUrl: './lol-game-tabs.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
})
export class LolGameTabsComponent {
  @Input()
  tabs: GameTab[] = [];

  @Input()
  activeId = '';

  @Output()
  tabSelected = new EventEmitter<string>();

  onSelect(tab: GameTab): void {
    if (tab.id !== this.activeId) {
      this.tabSelected.emit(tab.id);
    }
  }
}
