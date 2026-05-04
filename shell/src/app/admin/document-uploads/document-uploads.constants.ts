import { DocumentRow } from './document-uploads.types';

export const DOCUMENT_UPLOADS_SEED_DOCUMENTS: readonly DocumentRow[] = [
  { id: 1, name: 'invoice-march-2026.pdf', size: '142 KB', uploadedAt: '2026-03-31' },
  { id: 2, name: 'contract-vendor-acme.pdf', size: '1.2 MB', uploadedAt: '2026-04-12' },
  { id: 3, name: 'kyc-customer-3402.zip', size: '8.4 MB', uploadedAt: '2026-04-18' },
  { id: 4, name: '<img src=x onerror="alert(1)">.pdf', size: '0 B', uploadedAt: '2026-04-30' },
];

export const DOCUMENT_UPLOADS_BACK_LABEL_PREFIX = '<- ';

export const DOCUMENT_UPLOADS_I18N_KEYS = {
  PAGE_TITLE: 'ADMIN.DEMOS.DOCUMENTS.PAGE_TITLE',
  PAGE_LEAD: 'ADMIN.DEMOS.DOCUMENTS.PAGE_LEAD',
  PAYLOAD_TITLE: 'ADMIN.DEMOS.DOCUMENTS.PAYLOAD_TITLE',
  HOSTILE_ROW_NOTE: 'ADMIN.DEMOS.DOCUMENTS.HOSTILE_ROW_NOTE',
  WITHOUT_MITIGATION: 'ADMIN.DEMOS.DOCUMENTS.WITHOUT_MITIGATION',
  WITH_MITIGATION: 'ADMIN.DEMOS.DOCUMENTS.WITH_MITIGATION',
  COL_ID: 'ADMIN.DEMOS.DOCUMENTS.COL_ID',
  COL_NAME: 'ADMIN.DEMOS.DOCUMENTS.COL_NAME',
  COL_SIZE: 'ADMIN.DEMOS.DOCUMENTS.COL_SIZE',
  COL_UPLOADED: 'ADMIN.DEMOS.DOCUMENTS.COL_UPLOADED',
  BACK: 'ADMIN.DEMOS.BACK',
} as const;
