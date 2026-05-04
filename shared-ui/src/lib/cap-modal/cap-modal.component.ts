import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  input,
  model,
  output,
} from '@angular/core';
import { CapButtonComponent } from '../cap-button/cap-button.component';

@Component({
  selector: 'cap-modal',
  standalone: true,
  imports: [CommonModule, CapButtonComponent],
  templateUrl: './cap-modal.component.html',
  styleUrl: './cap-modal.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapModalComponent {
  readonly showModal = model<boolean>(false);
  readonly size = input<'small' | 'large' | 'extra-large' | 'standard'>('standard');
  readonly timeModalOpen = input<number | undefined>(undefined);
  readonly bgBlocked = input(false);
  readonly title = input<string>('');
  readonly image = input(false);
  readonly imageUrl = input('');
  readonly text = input<string>('');
  readonly showPrimaryButton = input(false);
  readonly showSecondaryButton = input(false);
  readonly labelPrimaryButton = input('Aceptar');
  readonly labelSecondaryButton = input('Cancelar');
  readonly isActiveNgContent = input(false);
  readonly tooltipModal = input(false);

  readonly closeModal = output<boolean>();
  readonly confirm = output<boolean>();

  ngOnChanges(): void {
    this.setTimeModalOpen();
    this.blockBodyScroll();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown($event: KeyboardEvent): void {
    if (!this.bgBlocked() && this.showModal()) {
      if ($event.key === 'Escape') {
        this.close();
      }
    }
  }

  onExit($event: MouseEvent): void {
    if (!this.bgBlocked()) {
      const targetElement = $event.target as HTMLElement;
      if (targetElement.id === 'modal-back') {
        this.close();
      }
    }
  }

  close(): void {
    this.closeModal.emit(false);
    this.blockBodyScroll();
  }

  handlePrimaryButtonClick(): void {
    this.confirm.emit(true);
    this.showModal.set(false);
  }

  setTimeModalOpen(): void {
    if (this.showModal() && this.timeModalOpen()) {
      setTimeout(() => {
        this.close();
      }, this.timeModalOpen());
    }
  }

  blockBodyScroll(): void {
    this.showModal()
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'auto');
  }
}
