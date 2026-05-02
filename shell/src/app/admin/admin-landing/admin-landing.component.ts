import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { CapInfoCardComponent } from '@capitalflow/shared-ui';
import { SECURITY_DEMOS, ADMIN_LANDING_I18N } from './admin-landing.constants';
import { SecurityDemo } from './admin-landing.types';

@Component({
  selector: 'app-admin-landing',
  standalone: true,
  imports: [CommonModule, TranslateModule, CapInfoCardComponent],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.scss'],
})
export class AdminLandingComponent {
  private readonly router = inject(Router);
  private readonly translate = inject(TranslateService);

  readonly demos: readonly SecurityDemo[] = SECURITY_DEMOS;
  readonly i18n = ADMIN_LANDING_I18N;

  trackByRoute(_index: number, demo: SecurityDemo): string {
    return demo.route;
  }

  navigateToDemo(route: string): void {
    this.router.navigate([route]);
  }

  translateKey(key: string): string {
    return this.translate.instant(key);
  }
}
