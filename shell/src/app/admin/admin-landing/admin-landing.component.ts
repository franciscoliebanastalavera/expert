import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SECURITY_DEMOS, ADMIN_LANDING_I18N } from './admin-landing.constants';
import { SecurityDemo } from './admin-landing.types';

@Component({
  selector: 'app-admin-landing',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './admin-landing.component.html',
  styleUrls: ['./admin-landing.component.scss'],
})
export class AdminLandingComponent {
  readonly demos: readonly SecurityDemo[] = SECURITY_DEMOS;
  readonly i18n = ADMIN_LANDING_I18N;

  trackByRoute(_index: number, demo: SecurityDemo): string {
    return demo.route;
  }
}
