import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslateModule } from '@ngx-translate/core';
import { Transaction } from '../core/models';

@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ScrollingModule, TranslateModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AnalyticsComponent implements OnInit {
  transacciones: Transaction[] = [];
  transaccionesFiltradas: Transaction[] = [];

  filtroTexto = '';
  filtroImporteMin: number | null = null;
  filtroImporteMax: number | null = null;

  totalIngresos = 0;
  totalGastos = 0;
  numTransacciones = 0;

  ngOnInit(): void {
    this.generarTransaccionesMock();
    this.aplicarFiltros();
  }

  private generarTransaccionesMock(): void {
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

    for (let i = 1; i <= 1000; i++) {
      const dia = String(Math.floor(Math.random() * 28) + 1).padStart(2, '0');
      const mes = String(Math.floor(Math.random() * 4) + 1).padStart(2, '0');
      const pais = paises[Math.floor(Math.random() * paises.length)];
      const numCuenta = Array.from({ length: 20 }, () => Math.floor(Math.random() * 10)).join('');
      const esIngreso = Math.random() > 0.45;

      this.transacciones.push({
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
  }

  aplicarFiltros(): void {
    let resultado = [...this.transacciones];

    if (this.filtroTexto.trim()) {
      const texto = this.filtroTexto.toLowerCase();
      resultado = resultado.filter(
        (t) =>
          t.descripcion.toLowerCase().includes(texto) ||
          t.tipo.toLowerCase().includes(texto) ||
          t.iban.toLowerCase().includes(texto) ||
          t.categoria.toLowerCase().includes(texto)
      );
    }

    if (this.filtroImporteMin !== null) {
      resultado = resultado.filter((t) => Math.abs(t.importe) >= this.filtroImporteMin!);
    }

    if (this.filtroImporteMax !== null) {
      resultado = resultado.filter((t) => Math.abs(t.importe) <= this.filtroImporteMax!);
    }

    this.transaccionesFiltradas = resultado;
    this.calcularEstadisticas();
  }

  private calcularEstadisticas(): void {
    this.numTransacciones = this.transaccionesFiltradas.length;
    this.totalIngresos = this.transaccionesFiltradas
      .filter((t) => t.importe > 0)
      .reduce((sum, t) => sum + t.importe, 0);
    this.totalGastos = this.transaccionesFiltradas
      .filter((t) => t.importe < 0)
      .reduce((sum, t) => sum + Math.abs(t.importe), 0);
  }

  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroImporteMin = null;
    this.filtroImporteMax = null;
    this.aplicarFiltros();
  }

  formatearIban(iban: string): string {
    return iban.replace(/(.{4})/g, '$1 ').trim();
  }

  formatearImporte(importe: number): string {
    const formatted = Math.abs(importe).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return importe >= 0 ? `+€${formatted}` : `-€${formatted}`;
  }

  trackById(index: number, item: Transaction): number {
    return item.id;
  }
}
