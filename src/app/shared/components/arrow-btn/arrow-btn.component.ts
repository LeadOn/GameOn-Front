import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-arrow-btn',
  templateUrl: './arrow-btn.component.html',
  styleUrls: ['./arrow-btn.component.scss'],
  standalone: false,
})
export class ArrowBtnComponent {
  @Input()
  link: string = '#';
}
