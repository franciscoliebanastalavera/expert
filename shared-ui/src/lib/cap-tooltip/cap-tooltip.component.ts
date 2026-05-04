import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  Input,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NG_VALUE_ACCESSOR } from '@angular/forms';
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
  @Input() titleTooltip: string;

  @Input() textTooltip: string;

  @Input() tooltipAlign: AlignVariant = 'center';

  @Input() invertVertical = false;

  @Input() enableTooltipModal = true;

  private readonly destroyRef = inject(DestroyRef);

  showTablet: boolean;
  showTooltip = false;
  showModalTooltip = false;

  constructor(private breakpointObserver: BreakpointObserver) {}

  ngOnInit() {
    this.breakpointObserver
      .observe(['(max-width: 768px)'])
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state: BreakpointState) => {
        this.showTablet = state.matches;
      });
  }

  hoverIcon(event: boolean): void {
    this.showTooltip = event;
  }

  openModalTooltip(event: boolean): void {
    if (this.enableTooltipModal) {
      this.showModalTooltip = event;
    }
  }
}
