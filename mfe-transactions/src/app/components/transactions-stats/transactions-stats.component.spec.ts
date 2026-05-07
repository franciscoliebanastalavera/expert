import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { TransactionsStatsComponent } from './transactions-stats.component';

describe('TransactionsStatsComponent', () => {
  let fixture: ComponentFixture<TransactionsStatsComponent>;
  let component: TransactionsStatsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TransactionsStatsComponent],
      providers: [
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TransactionsStatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('uses default 0 values for all inputs when none are provided', () => {
    expect(component.total()).toBe(0);
    expect(component.income()).toBe(0);
    expect(component.expenses()).toBe(0);
  });

  it('renders seven stat cards in the stats bar', () => {
    const cards = fixture.debugElement.queryAll(By.css('cap-stat-card'));
    expect(cards.length).toBe(7);
  });

  it('reflects the total input on the first stat card value attribute', () => {
    fixture.componentRef.setInput('total', 42);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('cap-stat-card'));
    expect(cards[0].nativeElement.getAttribute('ng-reflect-value')).toBe('42');
  });

  it('formats a positive amount with two decimals and the euro suffix', () => {
    expect(component.formatAmount(1234.5)).toBe('1234,50 \u20ac');
  });

  it('uses the absolute value when formatting a negative amount', () => {
    expect(component.formatAmount(-987.6)).toBe('987,60 \u20ac');
  });

  it('formats zero as 0,00 EUR', () => {
    expect(component.formatAmount(0)).toBe('0,00 \u20ac');
  });

  it('reflects income input as the formatted positive card value', () => {
    fixture.componentRef.setInput('income', 250.5);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('cap-stat-card'));
    expect(cards[1].nativeElement.getAttribute('ng-reflect-value')).toBe('250,50 \u20ac');
  });

  it('reflects expenses input as the negative-prefixed card value', () => {
    fixture.componentRef.setInput('expenses', 100);
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('cap-stat-card'));
    expect(cards[2].nativeElement.getAttribute('ng-reflect-value')).toBe('-100,00 \u20ac');
  });

  it('renders the performance metrics cards', () => {
    fixture.componentRef.setInput('datasetTotal', 120000);
    fixture.componentRef.setInput('total', 420);
    fixture.detectChanges();

    const cards = fixture.debugElement.queryAll(By.css('cap-stat-card'));
    expect(cards[3].nativeElement.getAttribute('ng-reflect-value')).toBe('120000');
    expect(cards[4].nativeElement.getAttribute('ng-reflect-value')).toBe('420');
    expect(cards[5].nativeElement.getAttribute('ng-reflect-value')).toBe('0');
    expect(cards[6].nativeElement.getAttribute('ng-reflect-value')).toBe('0.00');
  });
});
