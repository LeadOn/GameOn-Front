import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ChangeDetectionStrategy,
  inject,
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
export class FeedbackModalComponent implements AfterViewInit, OnDestroy {
  private readonly elementRef = inject(ElementRef<HTMLElement>);

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

  ngAfterViewInit(): void {
    // Re-parented to <body> so this full-screen overlay can never get
    // trapped behind an ancestor that establishes its own stacking context
    // (e.g. CommonLayoutComponent's positioned/z-indexed background wrapper).
    document.body.appendChild(this.elementRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.elementRef.nativeElement.remove();
  }
}
