import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-demo',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './search-demo.component.html',
  styleUrls: ['./search-demo.component.scss'],
})
export class SearchDemoComponent {
  readonly queryControl = new FormControl<string>('', { nonNullable: true });
  readonly query = signal<string>('');

  search(): void {
    this.query.set(this.queryControl.value);
  }
}
