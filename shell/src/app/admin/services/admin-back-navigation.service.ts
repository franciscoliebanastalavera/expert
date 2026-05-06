import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ADMIN_LANDING_ROUTE } from '../admin-landing/admin-landing.constants';

@Injectable({ providedIn: 'root' })
export class AdminBackNavigationService {
  private readonly router = inject(Router);

  goBack(): void {
    this.router.navigate([ADMIN_LANDING_ROUTE]);
  }
}
