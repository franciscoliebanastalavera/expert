import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';

const ALLOWED_REPORT_URL = /^https:\/\/[a-z0-9.-]+\/reports\/[a-z0-9._-]+\.pdf(\?[a-z0-9=&._-]*)?$/i;

@Component({
  selector: 'app-pdf-viewer',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './pdf-viewer.component.html',
  styleUrls: ['./pdf-viewer.component.scss'],
})
export class PdfViewerComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly urlControl = new FormControl<string>('https://reports.capitalflow.example.com/reports/q1-2026.pdf', {
    nonNullable: true,
    validators: [Validators.required],
  });

  readonly trustedUrl = signal<SafeResourceUrl | null>(null);
  readonly errorMessage = signal<string>('');

  load(): void {
    const candidate = this.urlControl.value.trim();
    this.errorMessage.set('');
    this.trustedUrl.set(null);

    if (!ALLOWED_REPORT_URL.test(candidate)) {
      this.errorMessage.set(
        'Invalid report URL. Only HTTPS URLs under /reports/ pointing to a .pdf file are allowed.'
      );
      return;
    }

    this.trustedUrl.set(this.sanitizer.bypassSecurityTrustResourceUrl(candidate));
  }
}
