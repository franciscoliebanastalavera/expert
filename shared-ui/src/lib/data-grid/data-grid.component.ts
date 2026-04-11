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
  template: `
    <div class="cf-grid-header" role="rowgroup">
      <div class="cf-grid-row cf-grid-header-row" role="row">
        @for (col of columns; track col.key) {
          <div
            class="cf-grid-cell cf-grid-header-cell"
            role="columnheader"
          >
            {{ col.label }}
          </div>
        }
      </div>
    </div>

    <cdk-virtual-scroll-viewport
      [itemSize]="rowHeight"
      class="cf-grid-viewport"
    >
      <div
        class="cf-grid-row"
        role="row"
        *cdkVirtualFor="let row of data"
        [style.height.px]="rowHeight"
        (click)="rowClick.emit(row)"
      >
        @for (col of columns; track col.key) {
          <div
            class="cf-grid-cell"
            role="cell"
          >
            {{ row[col.key] }}
          </div>
        }
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [
    `
      :host {
        display: block;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
      }

      .cf-grid-row {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e0e0e0;
      }

      .cf-grid-header-row {
        background-color: #f5f5f5;
        font-weight: 600;
      }

      .cf-grid-cell {
        flex: 1;
        padding: 0 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      .cf-grid-header-cell {
        height: 48px;
        display: flex;
        align-items: center;
      }

      .cf-grid-viewport {
        height: 400px;
      }

      .cf-grid-row:not(.cf-grid-header-row):hover {
        background-color: #fafafa;
        cursor: pointer;
      }
    `,
  ],
})
export class DataGridComponent {
  @Input() columns: DataGridColumn[] = [];

  @Input() data: Record<string, string | number | boolean>[] = [];

  @Input() rowHeight: number = 48;

  @Output() rowClick = new EventEmitter<Record<string, string | number | boolean>>();
}
