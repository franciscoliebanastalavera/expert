import { Injectable } from '@angular/core';
import { Transaction } from '../core/models';

@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private transactions: Transaction[] = [];

  getTransactions(): Transaction[] {
    if (this.transactions.length === 0) {
      this.transactions = this.generateMockTransactions();
    }
    return this.transactions;
  }

  filterTransactions(
    transactions: Transaction[],
    search: string,
    minAmount: number | null,
    maxAmount: number | null
  ): Transaction[] {
    let result = [...transactions];

    if (search.trim()) {
      const term = search.toLowerCase();
      result = result.filter(
        (t) =>
          t.descripcion.toLowerCase().includes(term) ||
          t.tipo.toLowerCase().includes(term) ||
          t.iban.toLowerCase().includes(term) ||
          t.categoria.toLowerCase().includes(term)
      );
    }

    if (minAmount !== null) {
      result = result.filter((t) => Math.abs(t.importe) >= minAmount);
    }

    if (maxAmount !== null) {
      result = result.filter((t) => Math.abs(t.importe) <= maxAmount);
    }

    return result;
  }

  calculateStats(transactions: Transaction[]): { total: number; income: number; expenses: number } {
    return {
      total: transactions.length,
      income: transactions.filter((t) => t.importe > 0).reduce((sum, t) => sum + t.importe, 0),
      expenses: transactions.filter((t) => t.importe < 0).reduce((sum, t) => sum + Math.abs(t.importe), 0),
    };
  }

  private generateMockTransactions(): Transaction[] {
    const tipos = ['Transferencia SEPA', 'Pago Nómina', 'Cobro Factura', 'Domiciliación', 'Transferencia Internacional', 'Pago Proveedor', 'Ingreso Cliente'];
    const estados = ['Completada', 'Procesando', 'Pendiente', 'Rechazada'];
    const categorias = ['Tesorería', 'Nóminas', 'Proveedores', 'Clientes', 'Impuestos', 'Seguros', 'Servicios'];
    const paises = ['ES', 'DE', 'FR', 'IT', 'PT', 'NL', 'BE'];
    const descripciones = [
      'Pago factura servicios profesionales',
      'Nómina empleados marzo 2026',
      'Cobro factura cliente Premium',
      'Domiciliación seguro empresarial',
      'Transferencia tesorería central',
      'Pago proveedor materias primas',
      'Ingreso por venta de activos',
      'Liquidación IVA trimestral',
      'Pago alquiler oficinas centrales',
      'Cobro intereses depósito a plazo',
    ];

    const result: Transaction[] = [];
    for (let i = 1; i <= 1000; i++) {
      const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const mes = String(Math.floor(Math.random() * 4) + 1).padStart(2, '0');
      const pais = paises[Math.floor(Math.random() * paises.length)];
      const numCuenta = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
      const esIngreso = Math.random() > 0.45;

      result.push({
        id: i,
        fecha: `${dia}/${mes}/2026`,
        tipo: tipos[Math.floor(Math.random() * tipos.length)],
        descripcion: descripciones[Math.floor(Math.random() * descripciones.length)],
        iban: `${pais}${numCuenta.slice(0, 22)}`,
        importe: esIngreso
          ? Math.round(Math.random() * 150000 * 100) / 100
          : -Math.round(Math.random() * 100000 * 100) / 100,
        divisa: 'EUR',
        estado: estados[Math.floor(Math.random() * estados.length)],
        categoria: categorias[Math.floor(Math.random() * categorias.length)],
      });
    }
    return result;
  }
}
