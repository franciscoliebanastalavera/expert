import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CapAlertComponent, CapButtonComponent } from '@capitalflow/shared-ui';
import { ADMIN_LANDING_ROUTE } from '../admin/admin-landing/admin-landing.constants';

const I18N_KEYS = {
  PAGE_TITLE: 'ADMIN.DEMOS.SEARCH.PAGE_TITLE',
  PAGE_LEAD: 'ADMIN.DEMOS.SEARCH.PAGE_LEAD',
  FIELD_LABEL: 'ADMIN.DEMOS.SEARCH.FIELD_LABEL',
  FIELD_HINT: 'ADMIN.DEMOS.SEARCH.FIELD_HINT',
  SEARCH_BUTTON: 'ADMIN.DEMOS.SEARCH.SEARCH_BUTTON',
  RESULTS_PREFIX: 'ADMIN.DEMOS.SEARCH.RESULTS_PREFIX',
  NOTE: 'ADMIN.DEMOS.SEARCH.NOTE',
  BACK: 'ADMIN.DEMOS.BACK',
} as const;

@Component({
  selector: 'app-search-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CapButtonComponent, CapAlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-demo.component.html',
  styleUrls: ['./search-demo.component.scss'],
})
export class SearchDemoComponent {
  private readonly router = inject(Router);

  readonly i18n = I18N_KEYS;
  readonly queryControl = new FormControl<string>('', { nonNullable: true });
  readonly query = signal<string>('');

  search(): void {
    this.query.set(this.queryControl.value);
  }

  goBack(): void {
    this.router.navigate([ADMIN_LANDING_ROUTE]);
  }
}
