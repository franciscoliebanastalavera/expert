import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { CapAlertComponent, CapButtonComponent, CapSpinnerComponent } from '@capitalflow/shared-ui';
import { TRANSACTIONS_REMOTE_MFE_CONFIG } from '../core/models';
import { MfeWrapperBaseComponent } from '../core/components/mfe-wrapper/mfe-wrapper-base.component';

@Component({
  selector: 'app-transactions-wrapper',
  standalone: true,
  imports: [TranslateModule, CapAlertComponent, CapButtonComponent, CapSpinnerComponent],
  templateUrl: '../core/components/mfe-wrapper/mfe-wrapper.template.html',
  styleUrls: ['../core/components/mfe-wrapper/mfe-wrapper.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
})
export class TransactionsWrapperComponent extends MfeWrapperBaseComponent {
  protected readonly config = TRANSACTIONS_REMOTE_MFE_CONFIG;
}
