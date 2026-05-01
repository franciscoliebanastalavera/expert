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
import { CapCellTemplateDirective } from './cap-cell-template.directive';
import { CapTableColumn } from './cap-table.types';

@Component({
  selector: 'cap-table',
  standalone: true,
  imports: [NgClass, NgFor, NgIf, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-table.component.html',
  styleUrl: './cap-table.component.scss',
})
export class CapTableComponent<T extends object = object> implements AfterContentInit {
  @Input() columns: readonly CapTableColumn[] = [];
  @Input() data: readonly T[] = [];
  @Input() trackByKey: keyof T | null = null;

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
