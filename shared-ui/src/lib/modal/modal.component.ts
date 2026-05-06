import { A11yModule } from '@angular/cdk/a11y';
import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

@Component({
  selector: 'cf-modal',
  standalone: true,
  imports: [A11yModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent {
  readonly isOpen = input(false);
  readonly title = input('');

  readonly closed = output<void>();

  readonly titleId = 'cf-modal-title-' + Math.random().toString(36).substring(2, 9);

  onBackdropClick(): void {
    this.onClose();
  }

  onClose(): void {
    this.closed.emit();
  }
}
