import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  contentChildren,
  input,
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CapCellTemplateDirective } from '../cap-table/cap-cell-template.directive';
import { CapTableColumn } from '../cap-table/cap-table.types';

const DEFAULT_ITEM_SIZE_PX = 48;
const DEFAULT_VIEWPORT_HEIGHT = '37.5rem';

@Component({
  selector: 'cap-data-grid',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-data-grid.component.html',
  styleUrl: './cap-data-grid.component.scss',
})
export class CapDataGridComponent<T extends object = object> implements AfterContentInit {
  readonly columns = input<readonly CapTableColumn[]>([]);
  readonly data = input<readonly T[]>([]);
  readonly trackByKey = input<keyof T | null>(null);
  readonly itemSize = input(DEFAULT_ITEM_SIZE_PX);
  readonly viewportHeight = input(DEFAULT_VIEWPORT_HEIGHT);

  readonly cellTemplates = contentChildren(CapCellTemplateDirective);

  private readonly templateMap = new Map<string, TemplateRef<unknown>>();

  ngAfterContentInit(): void {
    this.refreshTemplateMap();
  }

  templateFor(columnKey: string): TemplateRef<unknown> | null {
    this.refreshTemplateMap();
    return this.templateMap.get(columnKey) ?? null;
  }

  getCellValue(row: T, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }

  trackByRow = (index: number, row: T): unknown => {
    const key = this.trackByKey();
    if (key === null) {
      return index;
    }
    return row[key];
  };

  private refreshTemplateMap(): void {
    this.templateMap.clear();
    this.cellTemplates().forEach((entry) =>
      this.templateMap.set(entry.columnKey(), entry.templateRef)
    );
  }
}
