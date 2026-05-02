import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CapAlertKind } from './cap-alert.types';

@Component({
  selector: 'cap-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cap-alert.component.html',
  styleUrl: './cap-alert.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CapAlertComponent {
  @Input() kind: CapAlertKind = 'info';
  @Input() message: string = '';
}
