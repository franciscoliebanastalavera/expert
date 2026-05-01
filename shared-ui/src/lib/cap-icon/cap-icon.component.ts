import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

export const CAP_ICON_DEFAULT_SPRITE_PATH = '/assets/icons.svg';

@Component({
  selector: 'cap-icon',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-icon.component.html',
  styleUrl: './cap-icon.component.scss',
})
export class CapIconComponent {
  @Input({ required: true }) name!: string;
  @Input() spritePath: string = CAP_ICON_DEFAULT_SPRITE_PATH;

  get href(): string {
    return `${this.spritePath}#${this.name}`;
  }
}
