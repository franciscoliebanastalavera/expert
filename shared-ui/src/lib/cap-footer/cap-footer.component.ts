import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'cap-footer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cap-footer.component.html',
  styleUrls: ['./cap-footer.component.scss'],
})
export class CapFooterComponent {
  @Input() copyrightText = '© 2026 CapitalFlow by Nter.';
}
