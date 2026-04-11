import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  HostListener,
  Input,
  Output,
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
  @Input() showModal: boolean;

  @Input() size: 'small' | 'large' | 'extra-large' | 'standard' = 'standard';

  @Input() timeModalOpen: number;

  @Input() bgBlocked = false;

  @Input() title: string;

  @Input() image = false;

  @Input() imageUrl = '';

  @Input() text: string;

  @Input() showPrimaryButton = false;

  @Input() showSecondaryButton = false;

  @Input() labelPrimaryButton = 'Aceptar';

  @Input() labelSecondaryButton = 'Cancelar';

  @Input() isActiveNgContent = false;

  @Input() tooltipModal = false;

  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  @Output() confirm: EventEmitter<boolean> = new EventEmitter();

  ngOnChanges(): void {
    this.setTimeModalOpen();
    this.blockBodyScroll();
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown($event: KeyboardEvent): void {
    if (!this.bgBlocked && this.showModal) {
      if ($event.key === 'Escape') {
        this.close();
      }
    }
  }

  onExit($event: MouseEvent): void {
    if (!this.bgBlocked) {
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
    this.showModal = false;
  }

  setTimeModalOpen(): void {
    if (this.showModal && this.timeModalOpen) {
      setTimeout(() => {
        this.close();
      }, this.timeModalOpen);
    }
  }

  blockBodyScroll(): void {
    this.showModal
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'auto');
  }
}
