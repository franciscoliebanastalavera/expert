import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { combineLatest, map } from 'rxjs';
import {
  CapAlertComponent,
  CapButtonComponent,
  CapTableColumn,
  CapTableComponent,
} from '@capitalflow/shared-ui';
import { ADMIN_LANDING_ROUTE } from '../admin-landing/admin-landing.constants';
import {
  DOCUMENT_UPLOADS_BACK_LABEL_PREFIX,
  DOCUMENT_UPLOADS_I18N_KEYS,
  DOCUMENT_UPLOADS_SEED_DOCUMENTS,
} from './document-uploads.constants';

@Component({
  selector: 'app-document-uploads',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CapAlertComponent,
    CapButtonComponent,
    CapTableComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './document-uploads.component.html',
  styleUrls: ['./document-uploads.component.scss'],
})
export class DocumentUploadsComponent {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly i18n = DOCUMENT_UPLOADS_I18N_KEYS;
  readonly backLabelPrefix = DOCUMENT_UPLOADS_BACK_LABEL_PREFIX;
  readonly documents = signal(DOCUMENT_UPLOADS_SEED_DOCUMENTS);

  readonly columns = toSignal(
    combineLatest([
      this.translate.stream(DOCUMENT_UPLOADS_I18N_KEYS.COL_ID),
      this.translate.stream(DOCUMENT_UPLOADS_I18N_KEYS.COL_NAME),
      this.translate.stream(DOCUMENT_UPLOADS_I18N_KEYS.COL_SIZE),
      this.translate.stream(DOCUMENT_UPLOADS_I18N_KEYS.COL_UPLOADED),
    ]).pipe(
      map(([id, name, size, uploaded]): CapTableColumn[] => [
        { key: 'id', label: id as string },
        { key: 'name', label: name as string, cssClass: 'document-uploads__filename' },
        { key: 'size', label: size as string },
        { key: 'uploadedAt', label: uploaded as string },
      ]),
    ),
    { initialValue: [] as CapTableColumn[] },
  );

  goBack(): void {
    this.router.navigate([ADMIN_LANDING_ROUTE]);
  }
}
