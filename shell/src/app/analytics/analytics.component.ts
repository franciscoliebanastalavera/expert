import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ScrollingModule } from '@angular/cdk/scrolling';

// Interfaz para las transacciones financieras
interface Transaccion {
  id: number;
  fecha: string;
  tipo: string;
  descripcion: string;
  iban: string;
  importe: number;
  divisa: string;
  estado: string;
  categoria: string;
}

// Página de Analytics — DataGrid con 1000 transacciones y filtros
@Component({
  selector: 'app-analytics',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ScrollingModule],
  templateUrl: './analytics.component.html',
  styleUrls: ['./analytics.component.scss'],
})
export class AnalyticsComponent implements OnInit {
  // Datos completos y filtrados
  transacciones: Transaccion[] = [];
  transaccionesFiltradas: Transaccion[] = [];

  // Filtros
  filtroTexto = '';
  filtroFechaDesde = '';
  filtroFechaHasta = '';
  filtroImporteMin: number | null = null;
  filtroImporteMax: number | null = null;

  // Columnas del DataGrid
  columnas = [
    { key: 'id', label: 'ID', width: 60 },
    { key: 'fecha', label: 'Fecha', width: 100 },
    { key: 'tipo', label: 'Tipo', width: 120 },
    { key: 'descripcion', label: 'Descripción', width: 200 },
    { key: 'iban', label: 'IBAN', width: 250 },
    { key: 'importe', label: 'Importe', width: 120 },
    { key: 'estado', label: 'Estado', width: 100 },
    { key: 'categoria', label: 'Categoría', width: 120 },
  ];

  // Estadísticas
  totalIngresos = 0;
  totalGastos = 0;
  numTransacciones = 0;

  ngOnInit(): void {
    this.generarTransaccionesMock();
    this.aplicarFiltros();
  }

  // Genera 1000 transacciones financieras mock realistas
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

  // Aplica los filtros activos sobre las transacciones
  aplicarFiltros(): void {
    let resultado = [...this.transacciones];

    // Filtro por texto (busca en descripción, tipo, IBAN, categoría)
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

    // Filtro por importe mínimo
    if (this.filtroImporteMin !== null) {
      resultado = resultado.filter((t) => Math.abs(t.importe) >= this.filtroImporteMin!);
    }

    // Filtro por importe máximo
    if (this.filtroImporteMax !== null) {
      resultado = resultado.filter((t) => Math.abs(t.importe) <= this.filtroImporteMax!);
    }

    this.transaccionesFiltradas = resultado;
    this.calcularEstadisticas();
  }

  // Calcula estadísticas de las transacciones filtradas
  private calcularEstadisticas(): void {
    this.numTransacciones = this.transaccionesFiltradas.length;
    this.totalIngresos = this.transaccionesFiltradas
      .filter((t) => t.importe > 0)
      .reduce((sum, t) => sum + t.importe, 0);
    this.totalGastos = this.transaccionesFiltradas
      .filter((t) => t.importe < 0)
      .reduce((sum, t) => sum + Math.abs(t.importe), 0);
  }

  // Limpia todos los filtros
  limpiarFiltros(): void {
    this.filtroTexto = '';
    this.filtroFechaDesde = '';
    this.filtroFechaHasta = '';
    this.filtroImporteMin = null;
    this.filtroImporteMax = null;
    this.aplicarFiltros();
  }

  // Formatea un IBAN para mostrar (agrupa en bloques de 4)
  formatearIban(iban: string): string {
    return iban.replace(/(.{4})/g, '$1 ').trim();
  }

  // Formatea un importe con símbolo de euro
  formatearImporte(importe: number): string {
    const formatted = Math.abs(importe).toLocaleString('es-ES', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return importe >= 0 ? `+€${formatted}` : `-€${formatted}`;
  }

  // TrackBy para optimizar el renderizado del virtual scroll
  trackById(index: number, item: Transaccion): number {
    return item.id;
  }
}
