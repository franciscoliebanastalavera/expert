import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Componente Home — Dashboard principal con métricas financieras
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  // Métricas financieras mock para el dashboard
  metricas = [
    {
      titulo: 'Tesorería',
      valor: '€2.450.000',
      variacion: '+12.5%',
      icono: '🏦',
      positivo: true,
      descripcion: 'Saldo total en cuentas operativas',
      ruta: '/analytics',
    },
    {
      titulo: 'Pagos Pendientes',
      valor: '€380.000',
      variacion: '-8.3%',
      icono: '💳',
      positivo: true,
      descripcion: '47 transferencias programadas esta semana',
      ruta: '/analytics',
    },
    {
      titulo: 'Conciliaciones',
      valor: '94.2%',
      variacion: '+3.1%',
      icono: '✅',
      positivo: true,
      descripcion: '1.284 de 1.362 movimientos conciliados',
      ruta: '/analytics',
    },
    {
      titulo: 'Alertas Compliance',
      valor: '3',
      variacion: '+2',
      icono: '⚠️',
      positivo: false,
      descripcion: 'Operaciones pendientes de revisión AML',
      ruta: '/analytics',
    },
  ];

  // Pestañas del dashboard
  tabActiva = 'resumen';

  tabs = [
    { id: 'resumen', label: 'Resumen General' },
    { id: 'tesoreria', label: 'Tesorería' },
    { id: 'pagos', label: 'Pagos' },
    { id: 'compliance', label: 'Compliance' },
  ];

  // Últimas operaciones mock
  ultimasOperaciones = [
    { tipo: 'Transferencia SEPA', importe: '€45.200', fecha: '11/04/2026', estado: 'Completada', iban: 'ES9121000418450200051332' },
    { tipo: 'Pago Nóminas', importe: '€128.500', fecha: '10/04/2026', estado: 'Procesando', iban: 'ES7620770024003102575766' },
    { tipo: 'Cobro Factura', importe: '€15.800', fecha: '10/04/2026', estado: 'Completada', iban: 'ES0049001822162211067891' },
    { tipo: 'Transferencia Internacional', importe: '€92.000', fecha: '09/04/2026', estado: 'Pendiente', iban: 'DE89370400440532013000' },
    { tipo: 'Domiciliación', importe: '€3.200', fecha: '09/04/2026', estado: 'Completada', iban: 'FR7630006000011234567890189' },
  ];
}
