import { TransactionComment } from './comments-demo.types';

export const COMMENTS_TEST_PAYLOAD =
  '<script>alert("XSS in comment")</script><img src=x onerror=alert("img")>';

export const COMMENTS_SEED: readonly TransactionComment[] = [
  {
    id: 1,
    author: 'María García',
    transactionRef: 'TX-2026-0418-441',
    createdAt: '2026-04-18 09:14',
    text: 'Approved manually after bank confirmation call.',
  },
  {
    id: 2,
    author: 'Tomás Pereira',
    transactionRef: 'TX-2026-0419-507',
    createdAt: '2026-04-19 11:02',
    text: 'Pending KYC review for new counterparty in DE.',
  },
  {
    id: 3,
    author: 'Sofía Aliaga',
    transactionRef: 'TX-2026-0421-118',
    createdAt: '2026-04-21 16:35',
    text: 'Settlement delayed 2 business days; customer notified by email.',
  },
  {
    id: 4,
    author: 'attacker@external',
    transactionRef: 'TX-2026-0422-902',
    createdAt: '2026-04-22 23:58',
    text: '<script>alert("XSS")</script> Approved.',
  },
];

export const COMMENTS_BACK_LABEL_PREFIX = '<- ';

export const COMMENTS_DEMO_I18N_KEYS = {
  PAGE_TITLE: 'ADMIN.DEMOS.COMMENTS.PAGE_TITLE',
  PAGE_LEAD: 'ADMIN.DEMOS.COMMENTS.PAGE_LEAD',
  PAYLOAD_TITLE: 'ADMIN.DEMOS.COMMENTS.PAYLOAD_TITLE',
  INJECT_BUTTON: 'ADMIN.DEMOS.COMMENTS.INJECT_BUTTON',
  WITHOUT_MITIGATION: 'ADMIN.DEMOS.COMMENTS.WITHOUT_MITIGATION',
  WITH_MITIGATION: 'ADMIN.DEMOS.COMMENTS.WITH_MITIGATION',
  FIELD_LABEL: 'ADMIN.DEMOS.COMMENTS.FIELD_LABEL',
  FIELD_HINT: 'ADMIN.DEMOS.COMMENTS.FIELD_HINT',
  ADD_BUTTON: 'ADMIN.DEMOS.COMMENTS.ADD_BUTTON',
  THREAD_HEADING: 'ADMIN.DEMOS.COMMENTS.THREAD_HEADING',
  HOSTILE_NOTE: 'ADMIN.DEMOS.COMMENTS.HOSTILE_NOTE',
  AUTHOR_LABEL: 'ADMIN.DEMOS.COMMENTS.AUTHOR_LABEL',
  TX_REF_LABEL: 'ADMIN.DEMOS.COMMENTS.TX_REF_LABEL',
  EMPTY_INPUT: 'ADMIN.DEMOS.COMMENTS.EMPTY_INPUT',
  BACK: 'ADMIN.DEMOS.BACK',
} as const;

export const COMMENTS_DEMO_DEFAULT_AUTHOR = 'demo@capitalflow.io';
