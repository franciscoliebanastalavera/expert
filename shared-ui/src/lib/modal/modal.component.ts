import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

@Component({
  selector: 'cf-modal',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (isOpen) {
      <div
        class="cf-modal-backdrop"
        (click)="onBackdropClick()"
        (keydown.escape)="onClose()"
      >
        <div
          class="cf-modal-container"
          role="dialog"
          aria-modal="true"
          [attr.aria-labelledby]="titleId"
          cdkTrapFocus
          [cdkTrapFocusAutoCapture]="true"
          (click)="$event.stopPropagation()"
        >
          <div class="cf-modal-header">
            <h2 [id]="titleId" class="cf-modal-title">{{ title }}</h2>
            <button
              class="cf-modal-close-btn"
              type="button"
              aria-label="Cerrar"
              (click)="onClose()"
            >
              &times;
            </button>
          </div>

          <div class="cf-modal-body">
            <ng-content></ng-content>
          </div>
        </div>
      </div>
    }
  `,
  styles: [
    `
      .cf-modal-backdrop {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }

      .cf-modal-container {
        background: #ffffff;
        border-radius: 8px;
        box-shadow: 0 4px 24px rgba(0, 0, 0, 0.2);
        min-width: 400px;
        max-width: 90vw;
        max-height: 90vh;
        overflow: auto;
      }

      .cf-modal-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 16px 24px;
        border-bottom: 1px solid #e0e0e0;
      }

      .cf-modal-title {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
      }

      .cf-modal-close-btn {
        background: none;
        border: none;
        font-size: 1.5rem;
        cursor: pointer;
        padding: 0 4px;
        line-height: 1;
        color: #666;
      }

      .cf-modal-close-btn:hover {
        color: #000;
      }

      .cf-modal-body {
        padding: 24px;
      }
    `,
  ],
})
export class ModalComponent {
  @Input() isOpen: boolean = false;

  @Input() title: string = '';

  @Output() closed = new EventEmitter<void>();

  readonly titleId = 'cf-modal-title-' + Math.random().toString(36).substring(2, 9);

  onBackdropClick(): void {
    this.onClose();
  }

  onClose(): void {
    this.closed.emit();
  }
}
