import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  TemplateRef,
  contentChildren,
  input,
} from '@angular/core';
import { NgClass, NgTemplateOutlet } from '@angular/common';
import { CapCellTemplateDirective } from './cap-cell-template.directive';
import { CapTableColumn } from './cap-table.types';

@Component({
  selector: 'cap-table',
  standalone: true,
  imports: [NgClass, NgTemplateOutlet],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './cap-table.component.html',
  styleUrl: './cap-table.component.scss',
})
export class CapTableComponent<T extends object = object> implements AfterContentInit {
  readonly columns = input<readonly CapTableColumn[]>([]);
  readonly data = input<readonly T[]>([]);
  readonly trackByKey = input<keyof T | null>(null);

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
