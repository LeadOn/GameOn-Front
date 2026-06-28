import {
  Component,
  EventEmitter,
  Input,
  Output,
  ChangeDetectionStrategy,
} from '@angular/core';
import {
  faCheckCircle,
  faTriangleExclamation,
} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.css'],
  changeDetection: ChangeDetectionStrategy.Eager,
  standalone: false,
})
export class FeedbackModalComponent {
  successIcon = faCheckCircle;
  errorIcon = faTriangleExclamation;

  @Input()
  open = false;

  @Input()
  type: 'success' | 'error' = 'success';

  @Input()
  title = '';

  @Input()
  message = '';

  @Output()
  closed = new EventEmitter<void>();

  close() {
    this.closed.emit();
  }
}
