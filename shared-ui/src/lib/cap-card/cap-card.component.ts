// Componente Card — adaptado de Nter-lib
import { Component, Input, OnChanges, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicCssService } from '../services/dynamic-css.service';

@Component({
  selector: 'cap-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cap-card.component.html',
  styleUrls: ['./cap-card.component.scss'],
})
export class CapCardComponent implements OnChanges, OnDestroy {
  /**
   * Titulo de la tarjeta
   */
  @Input() title = '';

  /**
   * Subtitulo de la tarjeta
   */
  @Input() subtitle = '';

  /**
   * Contenido de la tarjeta
   */
  @Input() content = '';

  /**
   * Tipo de tarjeta: primaria o secundaria
   */
  @Input() type: 'primary' | 'secondary' = 'primary';

  /**
   * Radio del borde de la tarjeta
   */
  @Input() borderRadius = '20px';

  /**
   * Estilo CSS inline dinamico personalizado
   */
  @Input() customStyle = '';

  /**
   * Mixin predefinido a aplicar
   */
  @Input() mixin = 'TRANSPARENT_BACKGROUND';

  backgroundImage = '';
  cardClass = '';
  private componentId: string;

  constructor(private dynamicCss: DynamicCssService) {
    this.componentId = this.dynamicCss.generateComponentId();
  }

  ngOnChanges(): void {
    const base = 'public/';
    this.backgroundImage =
      this.type === 'secondary'
        ? `${base}fondoCapOpuesta.png`
        : `${base}fondoCap.png`;

    // Genera clase dinamica basada en los inputs
    this.cardClass = this.dynamicCss.createDynamicClass(
      'cap-card-dynamic',
      `
        border-radius: ${this.borderRadius};
        box-shadow: ${this.type === 'secondary'
          ? '0 10px 30px rgba(0,0,0,0.35)'
          : '0 6px 20px rgba(0,0,0,0.25)'};
        ${this.customStyle || this.mixin};
      `,
      this.componentId
    );
  }

  ngOnDestroy() {
    this.dynamicCss.removeComponentClasses(this.componentId);
  }
}
