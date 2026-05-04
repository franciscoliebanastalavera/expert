import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { CapButtonComponent, CapInfoCardComponent } from '@capitalflow/shared-ui';
import {
  ADMIN_MATRIX_I18N,
  EXPECTED_VULNERABILITY_COUNT,
  VULNERABILITIES_MATRIX,
} from './admin-landing.constants';
import { VulnerabilityRow } from './admin-landing.types';

@Component({
  selector: 'app-admin-landing',
  standalone: true,
  imports: [CommonModule, TranslateModule, CapButtonComponent, CapInfoCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.scss'],
})
export class AdminLandingComponent {
  private readonly router = inject(Router);

  readonly vulnerabilities: readonly VulnerabilityRow[] = VULNERABILITIES_MATRIX;
  readonly i18n = ADMIN_MATRIX_I18N;
  readonly totalCount = EXPECTED_VULNERABILITY_COUNT;

  trackById(_index: number, row: VulnerabilityRow): string {
    return row.id;
  }

  navigateToDemo(route: string | null): void {
    if (!route) {
      return;
    }
    this.router.navigate([route]);
  }
}
