import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-home-jungle-diff-banner',
  templateUrl: './home-jungle-diff-banner.component.html',
  styleUrl: './home-jungle-diff-banner.component.css',
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class HomeJungleDiffBannerComponent {
  jungleDiffUrl = 'https://www.junglediff.fr';
}
