import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapCellTemplateDirective } from './cap-cell-template.directive';
import { CapTableComponent } from './cap-table.component';
import { CapTableColumn } from './cap-table.types';

interface Row {
  id: number;
  name: string;
  amount: number;
}

@Component({
  standalone: true,
  imports: [CapTableComponent, CapCellTemplateDirective],
  template: `
    <cap-table [columns]="columns" [data]="data" [trackByKey]="trackByKey">
      <ng-template capCellTemplate="amount" let-value>
        <span class="amount-tpl">€ {{ value }}</span>
      </ng-template>
    </cap-table>
  `,
})
class HostComponent {
  columns: CapTableColumn[] = [
    { key: 'id', label: 'ID' },
    { key: 'name', label: 'Name', cssClass: 'name-cell' },
    { key: 'amount', label: 'Amount' },
  ];
  data: Row[] = [
    { id: 1, name: 'Alice', amount: 100 },
    { id: 2, name: 'Bob', amount: 200 },
  ];
  trackByKey: keyof Row | null = 'id';
}

describe('CapTableComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('creates the table component with the wrapper element', () => {
    const wrapper = fixture.debugElement.query(By.css('.cap-table__wrapper'));
    expect(wrapper).not.toBeNull();
    const table = fixture.debugElement.query(By.css('table.cap-table'));
    expect(table).not.toBeNull();
  });

  it('renders a header cell per column with the label and cssClass', () => {
    const headers = fixture.debugElement.queryAll(By.css('.cap-table__th'));
    expect(headers.length).toBe(3);
    expect(headers[0].nativeElement.textContent.trim()).toBe('ID');
    expect(headers[1].nativeElement.textContent.trim()).toBe('Name');
    expect(headers[1].nativeElement.classList.contains('name-cell')).toBeTrue();
    expect(headers[2].nativeElement.textContent.trim()).toBe('Amount');
  });

  it('renders one row per data entry with the default cell rendering', () => {
    const rows = fixture.debugElement.queryAll(By.css('.cap-table__row'));
    expect(rows.length).toBe(2);
    const cellsRow0 = rows[0].queryAll(By.css('.cap-table__td'));
    expect(cellsRow0[0].nativeElement.textContent.trim()).toBe('1');
    expect(cellsRow0[1].nativeElement.textContent.trim()).toBe('Alice');
  });

  it('uses the projected ng-template for the matching column', () => {
    const tplCells = fixture.debugElement.queryAll(By.css('.amount-tpl'));
    expect(tplCells.length).toBe(2);
    expect(tplCells[0].nativeElement.textContent.trim()).toBe('€ 100');
    expect(tplCells[1].nativeElement.textContent.trim()).toBe('€ 200');
  });

  it('renders an empty body when data is an empty array', () => {
    const host = fixture.componentInstance;
    host.data = [];
    fixture.detectChanges();
    const rows = fixture.debugElement.queryAll(By.css('.cap-table__row'));
    expect(rows.length).toBe(0);
  });

  it('uses trackByRow returning the keyed field when trackByKey is provided', () => {
    const tableDe = fixture.debugElement.query(By.directive(CapTableComponent));
    const tableInstance = tableDe.componentInstance as CapTableComponent<Row>;
    const result = tableInstance.trackByRow(0, { id: 7, name: 'X', amount: 0 });
    expect(result).toBe(7);
  });

  it('uses the index when trackByKey is null', () => {
    const host = fixture.componentInstance;
    host.trackByKey = null;
    fixture.detectChanges();
    const tableDe = fixture.debugElement.query(By.directive(CapTableComponent));
    const tableInstance = tableDe.componentInstance as CapTableComponent<Row>;
    const result = tableInstance.trackByRow(3, { id: 7, name: 'X', amount: 0 });
    expect(result).toBe(3);
  });
});
