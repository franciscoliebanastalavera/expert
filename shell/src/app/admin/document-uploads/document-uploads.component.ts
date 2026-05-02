import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { combineLatest, map } from 'rxjs';
import { CapButtonComponent, CapTableColumn, CapTableComponent } from '@capitalflow/shared-ui';
import { ADMIN_LANDING_ROUTE } from '../admin-landing/admin-landing.constants';

interface DocumentRow {
  readonly id: number;
  readonly name: string;
  readonly size: string;
  readonly uploadedAt: string;
}

const SEED_DOCUMENTS: readonly DocumentRow[] = [
  { id: 1, name: 'invoice-march-2026.pdf', size: '142 KB', uploadedAt: '2026-03-31' },
  { id: 2, name: 'contract-vendor-acme.pdf', size: '1.2 MB', uploadedAt: '2026-04-12' },
  { id: 3, name: 'kyc-customer-3402.zip', size: '8.4 MB', uploadedAt: '2026-04-18' },
  { id: 4, name: '<img src=x onerror="alert(1)">.pdf', size: '0 B', uploadedAt: '2026-04-30' },
];

const I18N_KEYS = {
  PAGE_TITLE: 'ADMIN.DEMOS.DOCUMENTS.PAGE_TITLE',
  PAGE_LEAD: 'ADMIN.DEMOS.DOCUMENTS.PAGE_LEAD',
  COL_ID: 'ADMIN.DEMOS.DOCUMENTS.COL_ID',
  COL_NAME: 'ADMIN.DEMOS.DOCUMENTS.COL_NAME',
  COL_SIZE: 'ADMIN.DEMOS.DOCUMENTS.COL_SIZE',
  COL_UPLOADED: 'ADMIN.DEMOS.DOCUMENTS.COL_UPLOADED',
  BACK: 'ADMIN.DEMOS.BACK',
} as const;

@Component({
  selector: 'app-document-uploads',
  standalone: true,
  imports: [CommonModule, TranslateModule, CapButtonComponent, CapTableComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './document-uploads.component.html',
  styleUrls: ['./document-uploads.component.scss'],
})
export class DocumentUploadsComponent {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly i18n = I18N_KEYS;
  readonly documents = signal<readonly DocumentRow[]>(SEED_DOCUMENTS);

  readonly columns = toSignal(
    combineLatest([
      this.translate.stream(I18N_KEYS.COL_ID),
      this.translate.stream(I18N_KEYS.COL_NAME),
      this.translate.stream(I18N_KEYS.COL_SIZE),
      this.translate.stream(I18N_KEYS.COL_UPLOADED),
    ]).pipe(
      map(([id, name, size, uploaded]): CapTableColumn[] => [
        { key: 'id', label: id as string },
        { key: 'name', label: name as string, cssClass: 'document-uploads__filename' },
        { key: 'size', label: size as string },
        { key: 'uploadedAt', label: uploaded as string },
      ])
    ),
    { initialValue: [] as CapTableColumn[] }
  );

  goBack(): void {
    this.router.navigate([ADMIN_LANDING_ROUTE]);
  }
}
