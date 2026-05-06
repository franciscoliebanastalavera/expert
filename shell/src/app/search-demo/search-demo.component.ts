import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CapAlertComponent, CapButtonComponent, CapInputComponent } from '@capitalflow/shared-ui';
import { AdminBackNavigationService } from '../admin/services/admin-back-navigation.service';
import {
  SEARCH_BACK_LABEL_PREFIX,
  SEARCH_DEMO_I18N_KEYS,
  SEARCH_TEST_PAYLOAD,
} from './search-demo.constants';

@Component({
  selector: 'app-search-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CapButtonComponent, CapAlertComponent, CapInputComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-demo.component.html',
  styleUrls: ['./search-demo.component.scss'],
})
export class SearchDemoComponent {
  private readonly backNavigation = inject(AdminBackNavigationService);

  readonly i18n = SEARCH_DEMO_I18N_KEYS;
  readonly backLabelPrefix = SEARCH_BACK_LABEL_PREFIX;
  readonly queryControl = new FormControl<string>('', { nonNullable: true });
  readonly query = signal<string>('');

  search(): void {
    this.query.set(this.queryControl.value);
  }

  injectTestPayload(): void {
    this.queryControl.setValue(SEARCH_TEST_PAYLOAD);
  }

  goBack(): void {
    this.backNavigation.goBack();
  }
}
