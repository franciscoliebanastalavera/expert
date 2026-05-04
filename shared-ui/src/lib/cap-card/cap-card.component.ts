import { Component, DestroyRef, Input, OnChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DynamicCssService } from '../services/dynamic-css.service';

@Component({
  selector: 'cap-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cap-card.component.html',
  styleUrls: ['./cap-card.component.scss'],
})
export class CapCardComponent implements OnChanges {
  @Input() title = '';

  @Input() subtitle = '';

  @Input() content = '';

  @Input() type: 'primary' | 'secondary' = 'primary';

  @Input() borderRadius = '20px';

  @Input() customStyle = '';

  @Input() mixin = 'TRANSPARENT_BACKGROUND';

  backgroundImage = '';
  cardClass = '';
  private componentId: string;
  private readonly destroyRef = inject(DestroyRef);

  constructor(private dynamicCss: DynamicCssService) {
    this.componentId = this.dynamicCss.generateComponentId();
    this.destroyRef.onDestroy(() => {
      this.dynamicCss.removeComponentClasses(this.componentId);
    });
  }

  ngOnChanges(): void {
    const base = 'public/';
    this.backgroundImage =
      this.type === 'secondary'
        ? `${base}fondoCapOpuesta.png`
        : `${base}fondoCap.png`;

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

}
