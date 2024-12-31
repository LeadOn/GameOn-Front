import { Component, Input, Output, EventEmitter } from '@angular/core';
import { faCheck, faClose } from '@fortawesome/free-solid-svg-icons';

@Component({
    selector: 'app-success-alert',
    templateUrl: './success-alert.component.html',
    styleUrls: ['./success-alert.component.scss'],
    standalone: false
})
export class SuccessAlertComponent {
  closeIcon = faClose;
  firstIcon = faCheck;

  @Input()
  show: boolean = true;
  @Output() showChange = new EventEmitter<boolean>();

  @Input()
  text: string = 'TEXT';

  close() {
    this.show = false;
    this.showChange.emit(false);
  }
}
