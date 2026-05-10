import { isDevMode } from '@angular/core';

export const environment = {
  production: !isDevMode(),
} as const;
