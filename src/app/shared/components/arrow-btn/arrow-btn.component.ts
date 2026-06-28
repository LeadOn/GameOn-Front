import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-arrow-btn',
  templateUrl: './arrow-btn.component.html',
  styleUrls: ['./arrow-btn.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class ArrowBtnComponent {
  @Input()
  link: string = '#';
}
