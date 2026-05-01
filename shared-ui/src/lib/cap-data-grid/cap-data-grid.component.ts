import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChildren,
  Input,
  QueryList,
  TemplateRef,
} from '@angular/core';
import { NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { CapCellTemplateDirective } from '../cap-table/cap-cell-template.directive';
import { CapTableColumn } from '../cap-table/cap-table.types';

const DEFAULT_ITEM_SIZE_PX = 48;
const DEFAULT_VIEWPORT_HEIGHT = '37.5rem';

@Component({
  selector: 'cap-data-grid',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgTemplateOutlet, ScrollingModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-data-grid.component.html',
  styleUrl: './cap-data-grid.component.scss',
})
export class CapDataGridComponent<T extends object = object> implements AfterContentInit {
  @Input() columns: readonly CapTableColumn[] = [];
  @Input() data: readonly T[] = [];
  @Input() trackByKey: keyof T | null = null;
  @Input() itemSize: number = DEFAULT_ITEM_SIZE_PX;
  @Input() viewportHeight: string = DEFAULT_VIEWPORT_HEIGHT;

  @ContentChildren(CapCellTemplateDirective) cellTemplates!: QueryList<CapCellTemplateDirective>;

  private readonly templateMap = new Map<string, TemplateRef<unknown>>();

  ngAfterContentInit(): void {
    this.refreshTemplateMap();
    this.cellTemplates.changes.subscribe(() => this.refreshTemplateMap());
  }

  templateFor(columnKey: string): TemplateRef<unknown> | null {
    return this.templateMap.get(columnKey) ?? null;
  }

  getCellValue(row: T, key: string): unknown {
    return (row as Record<string, unknown>)[key];
  }

  trackByRow = (index: number, row: T): unknown => {
    if (this.trackByKey === null) {
      return index;
    }
    return row[this.trackByKey];
  };

  private refreshTemplateMap(): void {
    this.templateMap.clear();
    this.cellTemplates.forEach((entry) =>
      this.templateMap.set(entry.columnKey, entry.templateRef)
    );
  }
}
