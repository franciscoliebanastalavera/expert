// Componente Tooltip — adaptado de Nter-lib
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, forwardRef, Input } from '@angular/core';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { AlignVariant } from '../core/types/components.types';
import { CapModalComponent } from '../cap-modal/cap-modal.component';

@Component({
  selector: 'cap-tooltip',
  standalone: true,
  imports: [CommonModule, CapModalComponent],
  templateUrl: './cap-tooltip.component.html',
  styleUrl: './cap-tooltip.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => CapTooltipComponent),
      multi: true,
    },
  ],
})
export class CapTooltipComponent {
  /**
   * Titulo del tooltip.
   */
  @Input() titleTooltip: string;

  /**
   * Texto del tooltip.
   */
  @Input() textTooltip: string;

  /**
   * Alineacion del tooltip, por defecto centrado.
   */
  @Input() tooltipAlign: AlignVariant = 'center';

  /**
   * Invertir la alineacion vertical respecto al tooltip.
   */
  @Input() invertVertical = false;

  /**
   * Habilitar funcionalidad modal en formato tablet (desde 768px).
   */
  @Input() enableTooltipModal = true;

  alive: Subject<boolean> = new Subject<boolean>();

  showTablet: boolean;
  showTooltip = false;
  showModalTooltip = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .pipe(takeUntil(this.alive))
      .subscribe((state: BreakpointState) => {
        this.showTablet = state.matches;
      });
  }

  /**
   * Muestra el tooltip cuando el raton esta sobre el icono.
   * @param event
   */
  hoverIcon(event: boolean): void {
    this.showTooltip = event;
  }

  /**
   * Muestra la version modal del tooltip.
   * @param event
   */
  openModalTooltip(event: boolean): void {
    if (this.enableTooltipModal) {
      this.showModalTooltip = event;
    }
  }

  ngOnDestroy(): void {
    this.alive.next(true);
    this.alive.unsubscribe();
  }
}
