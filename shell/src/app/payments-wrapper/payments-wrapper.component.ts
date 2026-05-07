import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, NgZone, inject } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CapAlertComponent, CapButtonComponent, CapSpinnerComponent } from '@capitalflow/shared-ui';
import { PAYMENTS_REMOTE_MFE_CONFIG } from '../core/models';
import { MfeWrapperBaseComponent } from '../core/components/mfe-wrapper/mfe-wrapper-base.component';

@Component({
  selector: 'app-payments-wrapper',
  standalone: true,
  imports: [TranslateModule, CapAlertComponent, CapButtonComponent, CapSpinnerComponent],
  templateUrl: '../core/components/mfe-wrapper/mfe-wrapper.template.html',
  styleUrls: ['../core/components/mfe-wrapper/mfe-wrapper.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class PaymentsWrapperComponent extends MfeWrapperBaseComponent {
  protected readonly config = PAYMENTS_REMOTE_MFE_CONFIG;
  private readonly ngZone = inject(NgZone);

  protected override createAndAppend(tag: string): void {
    this.ngZone.runOutsideAngular(() => {
      const el = this.document.createElement(tag);
      this.container().nativeElement.appendChild(el);
    });
  }
}
