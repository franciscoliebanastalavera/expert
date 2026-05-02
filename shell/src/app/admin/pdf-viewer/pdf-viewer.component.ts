import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CapAlertComponent, CapButtonComponent } from '@capitalflow/shared-ui';
import { ADMIN_LANDING_ROUTE } from '../admin-landing/admin-landing.constants';

const ALLOWED_REPORT_URL = /^https:\/\/[a-z0-9.-]+\/reports\/[a-z0-9._-]+\.pdf(\?[a-z0-9=&._-]*)?$/i;

const DEFAULT_URL = 'https://reports.capitalflow.example.com/reports/q1-2026.pdf';

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
  readonly urlControl = new FormControl<string>(DEFAULT_URL, {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly validatedUrl = signal<string>('');
  readonly errorKey = signal<string>('');

  load(): void {
    const candidate = this.urlControl.value.trim();
    this.errorKey.set('');
    this.validatedUrl.set('');

    if (!ALLOWED_REPORT_URL.test(candidate)) {
      this.errorKey.set(I18N_KEYS.INVALID_URL);
      return;
    }

    // The URL passed the allowlist regex. In production this is the boundary that
    // would feed bypassSecurityTrustResourceUrl + an iframe sandbox. For this demo
    // we surface the accepted URL — the security decision is what we are showcasing,
    // not the PDF render itself.
    this.validatedUrl.set(candidate);
  }

  goBack(): void {
    this.router.navigate([ADMIN_LANDING_ROUTE]);
  }
}
