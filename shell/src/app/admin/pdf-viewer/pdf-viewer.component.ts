import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { CapAlertComponent, CapButtonComponent } from '@capitalflow/shared-ui';
import { AdminBackNavigationService } from '../services/admin-back-navigation.service';
import {
  PDF_ALLOWED_HOSTS,
  PDF_BACK_LABEL_PREFIX,
  PDF_PATH_PATTERN,
  PDF_REQUIRED_PROTOCOL,
  PDF_TEST_PAYLOAD,
  PDF_VIEWER_I18N_KEYS,
  PDF_VIEWER_DEFAULT_URL,
} from './pdf-viewer.constants';

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, TranslateModule, CapButtonComponent, CapAlertComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent {
  private readonly backNavigation = inject(AdminBackNavigationService);

  readonly i18n = PDF_VIEWER_I18N_KEYS;
  readonly backLabelPrefix = PDF_BACK_LABEL_PREFIX;
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
      this.errorKey.set(PDF_VIEWER_I18N_KEYS.INVALID_URL);
      return;
    }

    this.validatedUrl.set(candidate);
  }

  injectTestPayload(): void {
    this.urlControl.setValue(PDF_TEST_PAYLOAD);
  }

  goBack(): void {
    this.backNavigation.goBack();
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
