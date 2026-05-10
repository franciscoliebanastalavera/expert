import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import {
  CapMetricCardComponent,
  CapStatusBadgeComponent,
  CapTableComponent,
} from '@capitalflow/shared-ui';
import { PaymentsComponent } from './payments.component';
import { PaymentStatus } from './payments.types';
import {
  AMOUNT_CURRENCY_SUFFIX,
  ICON_METRIC_ALERT,
  ICON_METRIC_PAYMENTS,
  ICON_METRIC_RECONCILIATION,
  KPI_AVG_TIME_VALUE,
  KPI_AVG_TIME_VARIATION,
  KPI_PENDING_VALUE,
  KPI_PENDING_VARIATION,
  KPI_VOLUME_VALUE,
  KPI_VOLUME_VARIATION,
  PAYMENTS_MOCK,
  PAYMENT_STATUS_KIND,
  PAYMENT_STATUS_LABEL,
  PAYMENT_TABLE_COLUMNS,
} from './payments.constants';

describe('PaymentsComponent', () => {
  let fixture: ComponentFixture<PaymentsComponent>;
  let instance: PaymentsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PaymentsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PaymentsComponent);
    instance = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('creates the component', () => {
    expect(instance).toBeInstanceOf(PaymentsComponent);
  });

  it('exposes the mock payment list (5 entries)', () => {
    expect(instance.payments).toBe(PAYMENTS_MOCK);
    expect(instance.payments.length).toBe(5);
  });

  it('exposes the table column definitions', () => {
    expect(instance.columns).toBe(PAYMENT_TABLE_COLUMNS);
    expect(instance.columns.map((c) => c.key)).toEqual(['id', 'beneficiary', 'amount', 'status', 'date']);
  });

  it('exposes the metric icon constants', () => {
    expect(instance.iconVolume).toBe(ICON_METRIC_PAYMENTS);
    expect(instance.iconPending).toBe(ICON_METRIC_ALERT);
    expect(instance.iconAvgTime).toBe(ICON_METRIC_RECONCILIATION);
  });

  it('exposes the status maps so the template can resolve label and badge kind', () => {
    expect(instance.statusLabel).toBe(PAYMENT_STATUS_LABEL);
    expect(instance.statusKind).toBe(PAYMENT_STATUS_KIND);
  });

  it('renders the section header with the Spanish title and the bilingual subtitle', () => {
    const title = fixture.debugElement.query(By.css('.payments__title'));
    const subtitle = fixture.debugElement.query(By.css('.payments__subtitle'));
    expect(title.nativeElement.textContent.trim()).toBe('Pagos Internacionales');
    expect(subtitle.nativeElement.textContent.trim()).toContain('International Payments');
    expect(subtitle.nativeElement.textContent.trim()).toContain('MFE Angular 17');
  });

  it('renders three cap-metric-card KPIs', () => {
    const cards = fixture.debugElement.queryAll(By.directive(CapMetricCardComponent));
    expect(cards.length).toBe(3);
  });

  it('binds value, variation and icon on each KPI card', () => {
    const cards = fixture.debugElement
      .queryAll(By.directive(CapMetricCardComponent))
      .map((d) => d.componentInstance as CapMetricCardComponent);
    const [volume, pending, avgTime] = cards;

    expect(volume.iconName()).toBe(ICON_METRIC_PAYMENTS);
    expect(volume.value()).toBe(KPI_VOLUME_VALUE);
    expect(volume.variation()).toBe(KPI_VOLUME_VARIATION);
    expect(volume.title()).toBe('Volumen Pagado');

    expect(pending.iconName()).toBe(ICON_METRIC_ALERT);
    expect(pending.value()).toBe(KPI_PENDING_VALUE);
    expect(pending.variation()).toBe(KPI_PENDING_VARIATION);
    expect(pending.title()).toBe('Pagos Pendientes');

    expect(avgTime.iconName()).toBe(ICON_METRIC_RECONCILIATION);
    expect(avgTime.value()).toBe(KPI_AVG_TIME_VALUE);
    expect(avgTime.variation()).toBe(KPI_AVG_TIME_VARIATION);
    expect(avgTime.title()).toBe('Tiempo Medio');
  });

  it('marks every KPI as positive (mock screenshot, not real data)', () => {
    const cards = fixture.debugElement
      .queryAll(By.directive(CapMetricCardComponent))
      .map((d) => d.componentInstance as CapMetricCardComponent);
    cards.forEach((card) => expect(card.positive()).toBeTrue());
  });

  it('renders a cap-table wired to the columns, mock payments and id-based trackBy', () => {
    const tableDebug = fixture.debugElement.query(By.directive(CapTableComponent));
    expect(tableDebug).not.toBeNull();
    const table = tableDebug.componentInstance as CapTableComponent;
    expect(table.columns()).toBe(PAYMENT_TABLE_COLUMNS);
    expect(table.data()).toBe(PAYMENTS_MOCK);
    expect(table.trackByKey()).toBe('id' as never);
  });

  it('renders one table body row per mock payment (5 rows)', () => {
    const rows = fixture.debugElement.queryAll(By.css('tr.cap-table__row'));
    expect(rows.length).toBe(PAYMENTS_MOCK.length);
  });

  it('renders the amount cell template with Spanish grouping and the € suffix', () => {
    const amountCells = fixture.debugElement.queryAll(By.css('.payments__amount'));
    expect(amountCells.length).toBe(PAYMENTS_MOCK.length);
    const first = amountCells[0].nativeElement.textContent.trim();
    expect(first.endsWith(AMOUNT_CURRENCY_SUFFIX.trim())).toBeTrue();
    expect(first).toContain('250.000,00');
  });

  it('renders a cap-status-badge per row with the kind and label resolved by status', () => {
    const badges = fixture.debugElement
      .queryAll(By.directive(CapStatusBadgeComponent));
    expect(badges.length).toBe(PAYMENTS_MOCK.length);
    PAYMENTS_MOCK.forEach((payment, index) => {
      const badge = badges[index].componentInstance as CapStatusBadgeComponent;
      expect(badge.kind()).toBe(PAYMENT_STATUS_KIND[payment.status]);
      const text = badges[index].nativeElement.textContent.trim();
      expect(text).toBe(PAYMENT_STATUS_LABEL[payment.status]);
    });
  });

  it('renders the footer note describing the phase-2 backend integration', () => {
    const footer = fixture.debugElement.query(By.css('.payments__footer'));
    expect(footer).not.toBeNull();
    const text = footer.nativeElement.textContent;
    expect(text).toContain('fase 2');
    expect(text).toContain('REST');
    expect(text).toContain('WebSocket');
  });

  it('uses ShadowDom encapsulation on the host element', () => {
    expect(fixture.nativeElement.shadowRoot).toBeTruthy();
  });

  describe('formatAmount', () => {
    it('formats integers with Spanish thousand separator and two decimals', () => {
      expect(instance.formatAmount(250_000)).toBe('250.000,00 €');
    });

    it('formats decimals preserving two fraction digits', () => {
      expect(instance.formatAmount(1234.56)).toBe('1.234,56 €');
    });

    it('formats small numbers without grouping but always with two decimals', () => {
      expect(instance.formatAmount(100)).toBe('100,00 €');
    });

    it('rounds beyond two fraction digits via Intl', () => {
      expect(instance.formatAmount(9.999)).toBe('10,00 €');
    });
  });

  describe('asStatus', () => {
    it('returns the value untouched, narrowed to PaymentStatus', () => {
      expect(instance.asStatus(PaymentStatus.Approved)).toBe(PaymentStatus.Approved);
      expect(instance.asStatus(PaymentStatus.Rejected)).toBe(PaymentStatus.Rejected);
    });

    it('does not validate the value (cast helper for the cell template)', () => {
      const arbitrary = 'not-a-real-status' as unknown;
      expect(instance.asStatus(arbitrary)).toBe(arbitrary as PaymentStatus);
    });
  });

  describe('PAYMENT_STATUS_KIND', () => {
    it('maps every PaymentStatus to a defined badge kind', () => {
      expect(PAYMENT_STATUS_KIND[PaymentStatus.Approved]).toBe('success');
      expect(PAYMENT_STATUS_KIND[PaymentStatus.Processing]).toBe('warning');
      expect(PAYMENT_STATUS_KIND[PaymentStatus.Pending]).toBe('info');
      expect(PAYMENT_STATUS_KIND[PaymentStatus.Rejected]).toBe('danger');
    });
  });

  describe('PAYMENT_STATUS_LABEL', () => {
    it('maps every PaymentStatus to its Spanish label', () => {
      expect(PAYMENT_STATUS_LABEL[PaymentStatus.Approved]).toBe('Aprobado');
      expect(PAYMENT_STATUS_LABEL[PaymentStatus.Processing]).toBe('Procesando');
      expect(PAYMENT_STATUS_LABEL[PaymentStatus.Pending]).toBe('Pendiente');
      expect(PAYMENT_STATUS_LABEL[PaymentStatus.Rejected]).toBe('Rechazado');
    });
  });
});
