import { SecurityDemo } from './admin-landing.types';

export const ADMIN_LANDING_I18N = {
  TITLE: 'ADMIN.LANDING.TITLE',
  LEAD: 'ADMIN.LANDING.LEAD',
  OPEN: 'ADMIN.DEMOS.OPEN',
} as const;

export const ADMIN_DEMO_ROUTES = {
  WYSIWYG: '/admin/templates',
  PDF: '/admin/reports',
  DOCUMENTS: '/admin/documents',
  SEARCH: '/search-demo',
} as const;

export const SECURITY_DEMOS: readonly SecurityDemo[] = [
  {
    titleKey: 'ADMIN.DEMOS.WYSIWYG.TITLE',
    descriptionKey: 'ADMIN.DEMOS.WYSIWYG.DESCRIPTION',
    route: ADMIN_DEMO_ROUTES.WYSIWYG,
    ctaKey: ADMIN_LANDING_I18N.OPEN,
  },
  {
    titleKey: 'ADMIN.DEMOS.PDF.TITLE',
    descriptionKey: 'ADMIN.DEMOS.PDF.DESCRIPTION',
    route: ADMIN_DEMO_ROUTES.PDF,
    ctaKey: ADMIN_LANDING_I18N.OPEN,
  },
  {
    titleKey: 'ADMIN.DEMOS.DOCUMENTS.TITLE',
    descriptionKey: 'ADMIN.DEMOS.DOCUMENTS.DESCRIPTION',
    route: ADMIN_DEMO_ROUTES.DOCUMENTS,
    ctaKey: ADMIN_LANDING_I18N.OPEN,
  },
  {
    titleKey: 'ADMIN.DEMOS.SEARCH.TITLE',
    descriptionKey: 'ADMIN.DEMOS.SEARCH.DESCRIPTION',
    route: ADMIN_DEMO_ROUTES.SEARCH,
    ctaKey: ADMIN_LANDING_I18N.OPEN,
  },
] as const;

export const EXPECTED_DEMO_COUNT = SECURITY_DEMOS.length;
