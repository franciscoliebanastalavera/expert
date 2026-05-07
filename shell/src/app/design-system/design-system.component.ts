import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
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

const STORYBOOK_PORT_BY_SHELL_PORT: Readonly<Record<string, number>> = {
  '4200': 6006,
  '8081': 6007,
};
const STORYBOOK_FALLBACK_PORT = 6007;

export function buildStorybookUrl(loc: Pick<Location, 'protocol' | 'hostname' | 'port'>): string {
  const port = STORYBOOK_PORT_BY_SHELL_PORT[loc.port] ?? STORYBOOK_FALLBACK_PORT;
  return `${loc.protocol}//${loc.hostname}:${port}`;
}

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
export class DesignSystemComponent {
  private readonly document = inject(DOCUMENT);
  readonly storybookUrl = buildStorybookUrl(this.document.location);
}
