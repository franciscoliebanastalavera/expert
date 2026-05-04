import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

export const CAP_ICON_DEFAULT_SPRITE_PATH = '/assets/icons.svg';

@Component({
  selector: 'cap-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-icon.component.html',
  styleUrl: './cap-icon.component.scss',
})
export class CapIconComponent {
  readonly name = input.required<string>();
  readonly spritePath = input(CAP_ICON_DEFAULT_SPRITE_PATH);

  readonly href = computed(() => `${this.spritePath()}#${this.name()}`);
}
