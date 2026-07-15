import { ChangeDetectionStrategy, Component } from '@angular/core';
import { faMoon, faSun } from '@fortawesome/free-solid-svg-icons';
import { ThemeService } from '../../services/common/theme.service';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ThemeToggleComponent {
  sunIcon = faSun;
  moonIcon = faMoon;

  constructor(public themeService: ThemeService) {}

  toggle(): void {
    this.themeService.toggle();
  }
}
