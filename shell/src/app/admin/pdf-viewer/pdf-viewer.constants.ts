export const PDF_ALLOWED_HOSTS: readonly string[] = [
  'reports.capitalflow.example.com',
  'cdn.capitalflow.example.com',
] as const;

export const PDF_PATH_PATTERN = /^\/reports\/[a-z0-9._-]+\.pdf(\?[a-z0-9=&._-]*)?$/i;
export const PDF_REQUIRED_PROTOCOL = 'https:';

export const PDF_VIEWER_DEFAULT_URL =
  'https://reports.capitalflow.example.com/reports/q1-2026.pdf';
