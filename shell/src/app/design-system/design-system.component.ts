import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import {
  CapAlertComponent,
  CapButtonComponent,
  CapInfoCardComponent,
  CapMetricCardComponent,
  CapSpinnerComponent,
  CapStatCardComponent,
  CapStatusBadgeComponent,
} from '@capitalflow/shared-ui';

@Component({
  selector: 'app-design-system',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    CapAlertComponent,
    CapButtonComponent,
    CapInfoCardComponent,
    CapMetricCardComponent,
    CapSpinnerComponent,
    CapStatCardComponent,
    CapStatusBadgeComponent,
  ],
  templateUrl: './design-system.component.html',
  styleUrl: './design-system.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DesignSystemComponent {}
