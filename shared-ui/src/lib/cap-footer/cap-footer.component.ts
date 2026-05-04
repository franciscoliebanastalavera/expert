import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cap-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cap-footer.component.html',
  styleUrls: ['./cap-footer.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapFooterComponent {
  readonly copyrightText = input('© 2026 CapitalFlow by Nter.');
}
