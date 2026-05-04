import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { CapCellTemplateDirective } from '../cap-table/cap-cell-template.directive';
import { CapTableColumn } from '../cap-table/cap-table.types';
import { CapDataGridComponent } from './cap-data-grid.component';

interface Row {
  id: number;
  name: string;
  amount: number;
}

@Component({
  standalone: true,
  imports: [CapDataGridComponent, CapCellTemplateDirective],
  template: `
    <cap-data-grid [columns]="columns" [data]="data" [trackByKey]="trackByKey" [itemSize]="itemSize">
      <ng-template capCellTemplate="amount" let-value>
        <span class="amount-tpl">EUR {{ value }}</span>
      </ng-template>
    </cap-data-grid>
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
  itemSize = 48;
}

describe('CapDataGridComponent', () => {
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    fixture.detectChanges();
  });

  it('creates the data grid component with the root wrapper', () => {
    const root = fixture.debugElement.query(By.css('.cap-data-grid'));
    expect(root).not.toBeNull();
    const inner = fixture.debugElement.query(By.css('.cap-data-grid__inner'));
    expect(inner).not.toBeNull();
  });

  it('renders one header cell per column with the right label and cssClass', () => {
    const headers = fixture.debugElement.queryAll(By.css('.cap-data-grid__cell--header'));
    expect(headers.length).toBe(3);
    expect(headers[0].nativeElement.textContent.trim()).toBe('ID');
    expect(headers[1].nativeElement.textContent.trim()).toBe('Name');
    expect(headers[1].nativeElement.classList.contains('name-cell')).toBeTrue();
    expect(headers[2].nativeElement.textContent.trim()).toBe('Amount');
  });

  it('renders the virtual scroll viewport that hosts the data rows', () => {
    const viewport = fixture.debugElement.query(By.css('cdk-virtual-scroll-viewport.cap-data-grid__viewport'));
    expect(viewport).not.toBeNull();
  });

  it('exposes the configured row data to the grid component', () => {
    const gridDe = fixture.debugElement.query(By.directive(CapDataGridComponent));
    const gridInstance = gridDe.componentInstance as CapDataGridComponent<Row>;
    expect(gridInstance.data().length).toBe(2);
    expect(gridInstance.data()[0].name).toBe('Alice');
    expect(gridInstance.getCellValue(gridInstance.data()[0], 'amount')).toBe(100);
  });

  it('registers the projected ng-template under its column key', () => {
    const gridDe = fixture.debugElement.query(By.directive(CapDataGridComponent));
    const gridInstance = gridDe.componentInstance as CapDataGridComponent<Row>;
    expect(gridInstance.cellTemplates().length).toBe(1);
    expect(gridInstance.templateFor('amount')).not.toBeNull();
    expect(gridInstance.templateFor('id')).toBeNull();
  });

  it('applies the viewportHeight via inline style', () => {
    const viewport = fixture.debugElement.query(By.css('.cap-data-grid__viewport'));
    expect((viewport.nativeElement as HTMLElement).style.height).toBe('37.5rem');
  });

  it('uses trackByRow returning the keyed field when trackByKey is provided', () => {
    const gridDe = fixture.debugElement.query(By.directive(CapDataGridComponent));
    const gridInstance = gridDe.componentInstance as CapDataGridComponent<Row>;
    const result = gridInstance.trackByRow(0, { id: 9, name: 'Z', amount: 0 });
    expect(result).toBe(9);
  });

  it('uses the index when trackByKey is null', () => {
    fixture.componentInstance.trackByKey = null;
    fixture.detectChanges();
    const gridDe = fixture.debugElement.query(By.directive(CapDataGridComponent));
    const gridInstance = gridDe.componentInstance as CapDataGridComponent<Row>;
    const result = gridInstance.trackByRow(7, { id: 9, name: 'Z', amount: 0 });
    expect(result).toBe(7);
  });

  it('does not render every row in the DOM when data is large (virtual scroll contract)', () => {
    const largeData: Row[] = Array.from({ length: 1000 }, (_, i) => ({
      id: i + 1,
      name: `Row ${i + 1}`,
      amount: i,
    }));
    fixture.componentInstance.data = largeData;
    fixture.detectChanges();

    const renderedRows = fixture.debugElement.queryAll(
      By.css('.cap-data-grid__row:not(.cap-data-grid__row--header)'),
    );
    expect(renderedRows.length).toBeLessThan(largeData.length);
  });

  it('renders less than 100 dom rows even with 80k dataset', () => {
    const largeData: Row[] = Array.from({ length: 80_000 }, (_, i) => ({
      id: i + 1,
      name: `Row ${i + 1}`,
      amount: i,
    }));
    fixture.componentInstance.data = largeData;
    fixture.detectChanges();

    const renderedRows = fixture.debugElement.queryAll(
      By.css('.cap-data-grid__row:not(.cap-data-grid__row--header)'),
    );
    expect(renderedRows.length).toBeLessThan(100);
  });
});
