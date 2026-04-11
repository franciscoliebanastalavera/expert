// Componente Modal — adaptado de Nter-lib
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
  /**
   *
   * Variable de control para la visibilidad del modal
   */
  @Input() showModal: boolean;

  /**
   *
   * Tamaño del modal
   */
  @Input() size: 'small' | 'large' | 'extra-large' | 'standard' = 'standard';

  /**
   *
   * Tiempo para el cierre del modal
   */
  @Input() timeModalOpen: number;

  /**
   *
   * Bloquear modal
   */
  @Input() bgBlocked = false;

  /**
   *
   * Título del modal
   */
  @Input() title: string;

  /**
   *
   * Activar imagen del modal
   */
  @Input() image = false;

  /**
   *
   * URL de la imagen del modal
   */
  @Input() imageUrl = '';

  /**
   *
   * Texto del modal
   */
  @Input() text: string;

  /**
   *
   * Mostrar botón primario
   */
  @Input() showPrimaryButton = false;

  /**
   *
   * Mostrar botón secundario
   */
  @Input() showSecondaryButton = false;

  /**
   *
   * Etiqueta del botón primario
   */
  @Input() labelPrimaryButton = 'Aceptar';

  /**
   *
   * Etiqueta del botón secundario
   */
  @Input() labelSecondaryButton = 'Cancelar';

  /**
   *
   * Activar ng-content
   */
  @Input() isActiveNgContent = false;

  /**
   *
   * Activar modal para tooltip
   */
  @Input() tooltipModal = false;

  /**
   * Evento emitido cuando se hace clic en el botón secundario
   */
  @Output() closeModal: EventEmitter<boolean> = new EventEmitter();

  /**
   * Evento emitido cuando se hace clic en el botón primario
   */
  @Output() confirm: EventEmitter<boolean> = new EventEmitter();

  ngOnChanges(): void {
    this.setTimeModalOpen();
    this.blockBodyScroll();
  }

  /**
   * Cerrar modal con la tecla Escape
   */
  @HostListener('document:keydown', ['$event'])
  onKeyDown($event: KeyboardEvent): void {
    if (!this.bgBlocked && this.showModal) {
      if ($event.key === 'Escape') {
        this.close();
      }
    }
  }

  /**
   * Activar cierre del modal al hacer clic en el fondo del modal.
   */
  onExit($event: MouseEvent): void {
    if (!this.bgBlocked) {
      const targetElement = $event.target as HTMLElement;
      if (targetElement.id === 'modal-back') {
        this.close();
      }
    }
  }

  /**
   * Cerrar modal. Manejar evento closeModal
   */
  close(): void {
    this.closeModal.emit(false);
    this.blockBodyScroll();
  }

  /**
   * Manejar evento clic del botón primario
   */
  handlePrimaryButtonClick(): void {
    this.confirm.emit(true);
    this.showModal = false;
  }

  /**
   * Establecer tiempo de cierre del modal
   */
  setTimeModalOpen(): void {
    if (this.showModal && this.timeModalOpen) {
      setTimeout(() => {
        this.close();
      }, this.timeModalOpen);
    }
  }

  /**
   * Bloquear scroll del body
   */
  blockBodyScroll(): void {
    this.showModal
      ? (document.body.style.overflow = 'hidden')
      : (document.body.style.overflow = 'auto');
  }
}
