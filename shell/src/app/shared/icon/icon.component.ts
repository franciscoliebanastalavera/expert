import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { ICON_SPRITE_PATH, IconName } from './icon.constants';

@Component({
  selector: 'app-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './icon.component.html',
  styleUrls: ['./icon.component.scss'],
})
export class IconComponent {
  readonly name = input.required<IconName>();
  readonly href = computed<string>(() => `${ICON_SPRITE_PATH}#${this.name()}`);
}
