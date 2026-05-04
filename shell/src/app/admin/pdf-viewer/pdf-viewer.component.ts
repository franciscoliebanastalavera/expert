import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CapAlertComponent, CapButtonComponent } from '@capitalflow/shared-ui';
import { ADMIN_LANDING_ROUTE } from '../admin-landing/admin-landing.constants';
import {
  PDF_ALLOWED_HOSTS,
  PDF_PATH_PATTERN,
  PDF_REQUIRED_PROTOCOL,
  PDF_VIEWER_DEFAULT_URL,
} from './pdf-viewer.constants';

const I18N_KEYS = {
  PAGE_TITLE: 'ADMIN.DEMOS.PDF.PAGE_TITLE',
  PAGE_LEAD: 'ADMIN.DEMOS.PDF.PAGE_LEAD',
  FIELD_LABEL: 'ADMIN.DEMOS.PDF.FIELD_LABEL',
  LOAD_BUTTON: 'ADMIN.DEMOS.PDF.LOAD_BUTTON',
  INVALID_URL: 'ADMIN.DEMOS.PDF.INVALID_URL',
  VALIDATED_HEADER: 'ADMIN.DEMOS.PDF.VALIDATED_HEADER',
  VALIDATED_NOTE: 'ADMIN.DEMOS.PDF.VALIDATED_NOTE',
  HINTS_TITLE: 'ADMIN.DEMOS.PDF.HINTS_TITLE',
  HINT_VALID: 'ADMIN.DEMOS.PDF.HINT_VALID',
  HINT_INVALID_PROTOCOL: 'ADMIN.DEMOS.PDF.HINT_INVALID_PROTOCOL',
  HINT_INVALID_HTTP: 'ADMIN.DEMOS.PDF.HINT_INVALID_HTTP',
  HINT_INVALID_PATH: 'ADMIN.DEMOS.PDF.HINT_INVALID_PATH',
  BACK: 'ADMIN.DEMOS.BACK',
} as const;

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CapButtonComponent, CapAlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent {
  private readonly router = inject(Router);

  readonly i18n = I18N_KEYS;
  readonly urlControl = new FormControl<string>(PDF_VIEWER_DEFAULT_URL, {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly validatedUrl = signal<string>('');
  readonly errorKey = signal<string>('');

  load(): void {
    const candidate = this.urlControl.value.trim();
    this.errorKey.set('');
    this.validatedUrl.set('');

    if (!this.isAllowedReportUrl(candidate)) {
      this.errorKey.set(I18N_KEYS.INVALID_URL);
      return;
    }

    this.validatedUrl.set(candidate);
  }

  goBack(): void {
    this.router.navigate([ADMIN_LANDING_ROUTE]);
  }

  private isAllowedReportUrl(rawUrl: string): boolean {
    try {
      const parsed = new URL(rawUrl);
      const reportPath = `${parsed.pathname}${parsed.search}`;
      return (
        parsed.protocol === PDF_REQUIRED_PROTOCOL &&
        PDF_ALLOWED_HOSTS.includes(parsed.host) &&
        PDF_PATH_PATTERN.test(reportPath)
      );
    } catch {
      return false;
    }
  }
}
