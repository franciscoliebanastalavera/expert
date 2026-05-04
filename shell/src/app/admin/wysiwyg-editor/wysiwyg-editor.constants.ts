export const WYSIWYG_TOOLBAR = [
  ['bold', 'italic', 'underline'],
  [{ list: 'ordered' }, { list: 'bullet' }],
  ['link'],
  ['clean'],
];

export const WYSIWYG_SAMPLE_TEMPLATE = `
  <h2>Quarterly compliance report - template</h2>
  <p>The following data block is replaced at render time with the regulatory dataset.</p>
  <ul><li>Reporting period</li><li>Counterparties</li><li>Total volume</li></ul>
`;

export const WYSIWYG_TEST_PAYLOAD =
  '<h1>Title</h1><script>alert("XSS")</script><img src=x onerror=alert("XSS-img")>';

export const WYSIWYG_BACK_LABEL_PREFIX = '<- ';

export const WYSIWYG_I18N_KEYS = {
  PAGE_TITLE: 'ADMIN.DEMOS.WYSIWYG.PAGE_TITLE',
  PAGE_LEAD: 'ADMIN.DEMOS.WYSIWYG.PAGE_LEAD',
  PAYLOAD_TITLE: 'ADMIN.DEMOS.WYSIWYG.PAYLOAD_TITLE',
  INJECT_BUTTON: 'ADMIN.DEMOS.WYSIWYG.INJECT_BUTTON',
  WITHOUT_MITIGATION: 'ADMIN.DEMOS.WYSIWYG.WITHOUT_MITIGATION',
  WITH_MITIGATION: 'ADMIN.DEMOS.WYSIWYG.WITH_MITIGATION',
  SAVE_BUTTON: 'ADMIN.DEMOS.WYSIWYG.SAVE_BUTTON',
  RAW_HEADING: 'ADMIN.DEMOS.WYSIWYG.RAW_HEADING',
  INJECTION_WARNING: 'ADMIN.DEMOS.WYSIWYG.INJECTION_WARNING',
  SANITIZED_HEADING: 'ADMIN.DEMOS.WYSIWYG.SANITIZED_HEADING',
  BACK: 'ADMIN.DEMOS.BACK',
} as const;
