import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

export interface DataGridColumn {
  key: string;
  label: string;
}

@Component({
  selector: 'cf-data-grid',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './data-grid.component.html',
  styleUrls: ['./data-grid.component.scss'],
})
export class DataGridComponent {
  @Input() columns: DataGridColumn[] = [];

  @Input() data: Record<string, string | number | boolean>[] = [];

  @Input() rowHeight: number = 48;

  @Output() rowClick = new EventEmitter<Record<string, string | number | boolean>>();
}
