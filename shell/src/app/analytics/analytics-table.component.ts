import { Component, Input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';
import { Transaction } from '../core/models';

@Component({
  selector: 'app-analytics-table',
  standalone: true,
  imports: [CommonModule, ScrollingModule, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="datagrid-container">
      <div class="datagrid-header">
        <div class="dg-cell dg-id">{{ 'ANALYTICS.GRID.ID' | translate }}</div>
        <div class="dg-cell dg-fecha">{{ 'ANALYTICS.GRID.DATE' | translate }}</div>
        <div class="dg-cell dg-tipo">{{ 'ANALYTICS.GRID.TYPE' | translate }}</div>
        <div class="dg-cell dg-desc">{{ 'ANALYTICS.GRID.DESCRIPTION' | translate }}</div>
        <div class="dg-cell dg-iban">{{ 'ANALYTICS.GRID.IBAN' | translate }}</div>
        <div class="dg-cell dg-importe">{{ 'ANALYTICS.GRID.AMOUNT' | translate }}</div>
        <div class="dg-cell dg-estado">{{ 'ANALYTICS.GRID.STATUS' | translate }}</div>
        <div class="dg-cell dg-cat">{{ 'ANALYTICS.GRID.CATEGORY' | translate }}</div>
      </div>
      <cdk-virtual-scroll-viewport itemSize="48" class="datagrid-body">
        <div class="datagrid-row" *cdkVirtualFor="let t of transactions; trackBy: trackById">
          <div class="dg-cell dg-id">{{ t.id }}</div>
          <div class="dg-cell dg-fecha">{{ t.fecha }}</div>
          <div class="dg-cell dg-tipo">{{ t.tipo }}</div>
          <div class="dg-cell dg-desc">{{ t.descripcion }}</div>
          <div class="dg-cell dg-iban">{{ formatIban(t.iban) }}</div>
          <div class="dg-cell dg-importe" [class.ingreso]="t.importe >= 0" [class.gasto]="t.importe < 0">
            {{ formatAmount(t.importe) }}
          </div>
          <div class="dg-cell dg-estado">
            <span class="estado-badge" [ngClass]="{ completada: t.estado === 'Completada', procesando: t.estado === 'Procesando', pendiente: t.estado === 'Pendiente', rechazada: t.estado === 'Rechazada' }">{{ t.estado }}</span>
          </div>
          <div class="dg-cell dg-cat">{{ t.categoria }}</div>
        </div>
      </cdk-virtual-scroll-viewport>
    </div>
  `,
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsTableComponent {
  @Input() transactions: Transaction[] = [];

  trackById(index: number, item: Transaction): number {
    return item.id;
  }

  formatIban(iban: string): string {
    return iban.replace(/(.{4})/g, '$1 ').trim();
  }

  formatAmount(importe: number): string {
    const formatted = Math.abs(importe).toLocaleString('es-ES', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return importe >= 0 ? `+€${formatted}` : `-€${formatted}`;
  }
}
