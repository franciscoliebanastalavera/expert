import { VulnerabilityRow } from './admin-landing.types';

export const ADMIN_LANDING_ROUTE = '/admin';

export const ADMIN_DEMO_ROUTES = {
  WYSIWYG: '/admin/templates',
  PDF: '/admin/reports',
  DOCUMENTS: '/admin/documents',
  SEARCH: '/search-demo',
} as const;

export const ADMIN_MATRIX_I18N = {
  TITLE: 'ADMIN.MATRIX.TITLE',
  LEAD: 'ADMIN.MATRIX.LEAD',
  SUMMARY_TITLE: 'ADMIN.MATRIX.SUMMARY_TITLE',
  SUMMARY_DESCRIPTION: 'ADMIN.MATRIX.SUMMARY_DESCRIPTION',
  OPEN_DEMO: 'ADMIN.MATRIX.OPEN_DEMO',
} as const;

export const VULNERABILITIES_MATRIX: readonly VulnerabilityRow[] = [
  {
    id: 'briefing-01',
    source: 'briefing',
    titleKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_01.TITLE',
    descriptionKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_01.DESCRIPTION',
    mitigationKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_01.MITIGATION',
    status: 'partial',
    demoRoute: null,
    fileReferences: ['shared-ui/src/lib/safe-html/safe-html.pipe.ts'],
  },
  {
    id: 'briefing-02',
    source: 'briefing',
    titleKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_02.TITLE',
    descriptionKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_02.DESCRIPTION',
    mitigationKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_02.MITIGATION',
    status: 'mitigated',
    demoRoute: ADMIN_DEMO_ROUTES.PDF,
    fileReferences: [
      'shell/src/app/admin/pdf-viewer/pdf-viewer.component.ts',
      'shell/src/app/admin/pdf-viewer/pdf-viewer.constants.ts',
    ],
  },
  {
    id: 'briefing-03',
    source: 'briefing',
    titleKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_03.TITLE',
    descriptionKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_03.DESCRIPTION',
    mitigationKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_03.MITIGATION',
    status: 'mitigated',
    demoRoute: ADMIN_DEMO_ROUTES.DOCUMENTS,
    fileReferences: [
      'shell/src/app/admin/document-uploads/document-uploads.component.html',
      'shared-ui/src/lib/cap-table/cap-table.component.html',
    ],
  },
  {
    id: 'briefing-04',
    source: 'briefing',
    titleKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_04.TITLE',
    descriptionKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_04.DESCRIPTION',
    mitigationKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_04.MITIGATION',
    status: 'mitigated',
    demoRoute: ADMIN_DEMO_ROUTES.SEARCH,
    fileReferences: ['shell/src/app/search-demo/search-demo.component.html'],
  },
  {
    id: 'briefing-05',
    source: 'briefing',
    titleKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_05.TITLE',
    descriptionKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_05.DESCRIPTION',
    mitigationKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_05.MITIGATION',
    status: 'mitigated',
    demoRoute: ADMIN_DEMO_ROUTES.WYSIWYG,
    fileReferences: [
      'shell/src/app/admin/wysiwyg-editor/wysiwyg-editor.component.ts',
      'shared-ui/src/lib/safe-html/safe-html.pipe.ts',
    ],
  },
  {
    id: 'briefing-06',
    source: 'briefing',
    titleKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_06.TITLE',
    descriptionKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_06.DESCRIPTION',
    mitigationKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_06.MITIGATION',
    status: 'mitigated',
    demoRoute: null,
    fileReferences: ['shell/nginx.conf'],
  },
  {
    id: 'briefing-07',
    source: 'briefing',
    titleKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_07.TITLE',
    descriptionKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_07.DESCRIPTION',
    mitigationKey: 'ADMIN.MATRIX.ITEMS.BRIEFING_07.MITIGATION',
    status: 'documented',
    demoRoute: null,
    fileReferences: ['README.md'],
  },
  {
    id: 'additional-01',
    source: 'additional-control',
    titleKey: 'ADMIN.MATRIX.ITEMS.ADDITIONAL_01.TITLE',
    descriptionKey: 'ADMIN.MATRIX.ITEMS.ADDITIONAL_01.DESCRIPTION',
    mitigationKey: 'ADMIN.MATRIX.ITEMS.ADDITIONAL_01.MITIGATION',
    status: 'documented',
    demoRoute: null,
    fileReferences: ['README.md'],
  },
  {
    id: 'additional-02',
    source: 'additional-control',
    titleKey: 'ADMIN.MATRIX.ITEMS.ADDITIONAL_02.TITLE',
    descriptionKey: 'ADMIN.MATRIX.ITEMS.ADDITIONAL_02.DESCRIPTION',
    mitigationKey: 'ADMIN.MATRIX.ITEMS.ADDITIONAL_02.MITIGATION',
    status: 'partial',
    demoRoute: null,
    fileReferences: ['package-lock.json', '.gitlab-ci.yml'],
  },
  {
    id: 'additional-03',
    source: 'additional-control',
    titleKey: 'ADMIN.MATRIX.ITEMS.ADDITIONAL_03.TITLE',
    descriptionKey: 'ADMIN.MATRIX.ITEMS.ADDITIONAL_03.DESCRIPTION',
    mitigationKey: 'ADMIN.MATRIX.ITEMS.ADDITIONAL_03.MITIGATION',
    status: 'partial',
    demoRoute: null,
    fileReferences: ['.gitignore', '.gitlab-ci.yml'],
  },
  {
    id: 'additional-04',
    source: 'additional-control',
    titleKey: 'ADMIN.MATRIX.ITEMS.ADDITIONAL_04.TITLE',
    descriptionKey: 'ADMIN.MATRIX.ITEMS.ADDITIONAL_04.DESCRIPTION',
    mitigationKey: 'ADMIN.MATRIX.ITEMS.ADDITIONAL_04.MITIGATION',
    status: 'documented',
    demoRoute: null,
    fileReferences: ['README.md'],
  },
] as const;

export const EXPECTED_VULNERABILITY_COUNT = VULNERABILITIES_MATRIX.length;
