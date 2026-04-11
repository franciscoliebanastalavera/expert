import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy,
} from '@angular/core';

/** Definicion de una columna del DataGrid */
export interface DataGridColumn {
  /** Clave del campo en el objeto de datos */
  key: string;
  /** Etiqueta visible en la cabecera */
  label: string;
}

/**
 * Componente DataGrid con virtual scroll.
 * Utiliza CdkVirtualScrollViewport y CdkVirtualForOf del CDK
 * para renderizar grandes volumenes de filas de forma eficiente.
 */
@Component({
  selector: 'cf-data-grid',
  standalone: false,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <!-- Cabecera de la tabla -->
    <div class="cf-grid-header" role="rowgroup">
      <div class="cf-grid-row cf-grid-header-row" role="row">
        <div
          class="cf-grid-cell cf-grid-header-cell"
          role="columnheader"
          *ngFor="let col of columns"
        >
          {{ col.label }}
        </div>
      </div>
    </div>

    <!-- Cuerpo con virtual scroll -->
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
        <div
          class="cf-grid-cell"
          role="cell"
          *ngFor="let col of columns"
        >
          {{ row[col.key] }}
        </div>
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [
    `
      /* Contenedor principal del grid */
      :host {
        display: block;
        border: 1px solid #e0e0e0;
        border-radius: 4px;
        overflow: hidden;
      }

      /* Filas del grid */
      .cf-grid-row {
        display: flex;
        align-items: center;
        border-bottom: 1px solid #e0e0e0;
      }

      /* Fila de cabecera */
      .cf-grid-header-row {
        background-color: #f5f5f5;
        font-weight: 600;
      }

      /* Celdas */
      .cf-grid-cell {
        flex: 1;
        padding: 0 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }

      /* Celda de cabecera */
      .cf-grid-header-cell {
        height: 48px;
        display: flex;
        align-items: center;
      }

      /* Viewport del virtual scroll */
      .cf-grid-viewport {
        height: 400px;
      }

      /* Efecto hover en filas del cuerpo */
      .cf-grid-row:not(.cf-grid-header-row):hover {
        background-color: #fafafa;
        cursor: pointer;
      }
    `,
  ],
})
export class DataGridComponent {
  /** Definicion de columnas a mostrar */
  @Input() columns: DataGridColumn[] = [];

  /** Datos a renderizar en las filas */
  @Input() data: any[] = [];

  /** Altura de cada fila en pixeles (para el virtual scroll) */
  @Input() rowHeight: number = 48;

  /** Evento emitido al hacer clic en una fila */
  @Output() rowClick = new EventEmitter<any>();
}
