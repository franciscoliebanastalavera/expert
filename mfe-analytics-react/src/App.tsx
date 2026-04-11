import React, { useState, useEffect } from 'react';

type Lang = 'es' | 'en';

const translations: Record<Lang, Record<string, string>> = {
  es: {
    title: 'Dashboard de Analytics',
    subtitle: 'CapitalFlow - Resumen financiero en tiempo real',
    recentTx: 'Transacciones Recientes',
    totalIncome: 'INGRESOS TOTALES',
    opExpenses: 'GASTOS OPERATIVOS',
    netProfit: 'BENEFICIO NETO',
    activeClients: 'CLIENTES ACTIVOS',
    completed: 'Completada',
    pending: 'Pendiente',
    inProgress: 'En proceso',
    vsLastMonth: 'vs. mes anterior',
    colId: 'ID',
    colDate: 'Fecha',
    colConcept: 'Concepto',
    colAmount: 'Importe',
    colStatus: 'Estado',
    txSepa: 'Transferencia SEPA',
    txPayroll: 'Pago nóminas',
    txInvoice: 'Cobro factura #892',
    txFee: 'Comisión bancaria',
    txInvestment: 'Inversión fondo A',
  },
  en: {
    title: 'Analytics Dashboard',
    subtitle: 'CapitalFlow - Real-time financial overview',
    recentTx: 'Recent Transactions',
    totalIncome: 'TOTAL INCOME',
    opExpenses: 'OPERATING EXPENSES',
    netProfit: 'NET PROFIT',
    activeClients: 'ACTIVE CLIENTS',
    completed: 'Completed',
    pending: 'Pending',
    inProgress: 'In progress',
    vsLastMonth: 'vs. last month',
    colId: 'ID',
    colDate: 'Date',
    colConcept: 'Concept',
    colAmount: 'Amount',
    colStatus: 'Status',
    txSepa: 'SEPA Transfer',
    txPayroll: 'Payroll payment',
    txInvoice: 'Invoice #892 collection',
    txFee: 'Bank fee',
    txInvestment: 'Fund A investment',
  },
};

function detectLang(): Lang {
  const htmlLang = document.documentElement.lang?.toLowerCase();
  if (htmlLang === 'en') return 'en';
  return 'es';
}

const estilos = {
  contenedor: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '1.5rem',
    backgroundColor: 'var(--cap-bg, #f4f6f9)',
    minHeight: '100%',
    color: 'var(--cap-text, #1a1a2e)',
  } as React.CSSProperties,
  encabezado: {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: '0.5rem',
    color: 'var(--cap-text, #1a1a2e)',
  } as React.CSSProperties,
  subtitulo: {
    fontSize: '0.875rem',
    color: 'var(--cap-text-muted, #6b7280)',
    marginBottom: '1.5rem',
  } as React.CSSProperties,
  cuadriculaKPI: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(13.75rem, 1fr))',
    gap: '1rem',
    marginBottom: '2rem',
  } as React.CSSProperties,
  tarjetaKPI: {
    backgroundColor: 'var(--cap-bg-surface, #fff)',
    borderRadius: '0.75rem',
    padding: '1.25rem',
    boxShadow: 'var(--cap-shadow-sm, 0 1px 3px rgba(0,0,0,0.1))',
    border: '0.0625rem solid var(--cap-border, #e5e7eb)',
  } as React.CSSProperties,
  tituloKPI: {
    fontSize: '0.8125rem',
    color: 'var(--cap-text-muted, #6b7280)',
    marginBottom: '0.5rem',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.03rem',
  } as React.CSSProperties,
  valorKPI: {
    fontSize: '1.75rem',
    fontWeight: 700,
    marginBottom: '0.25rem',
  } as React.CSSProperties,
  tabla: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    backgroundColor: 'var(--cap-bg-surface, #fff)',
    borderRadius: '0.75rem',
    overflow: 'hidden',
    boxShadow: 'var(--cap-shadow-sm, 0 1px 3px rgba(0,0,0,0.1))',
  } as React.CSSProperties,
  celdaEncabezado: {
    textAlign: 'left' as const,
    padding: '0.875rem 1rem',
    backgroundColor: 'var(--cap-primary, #1a1a2e)',
    color: '#ffffff',
    fontSize: '0.8125rem',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.03rem',
  } as React.CSSProperties,
  celda: {
    padding: '0.75rem 1rem',
    borderBottom: '0.0625rem solid var(--cap-border, #f0f0f0)',
    fontSize: '0.875rem',
  } as React.CSSProperties,
  tituloSeccion: {
    fontSize: '1.125rem',
    fontWeight: 600,
    marginBottom: '1rem',
    color: 'var(--cap-text, #1a1a2e)',
  } as React.CSSProperties,
};

const TarjetaKPI: React.FC<{
  titulo: string;
  valor: string;
  variacion: string;
  positivo: boolean;
  vsText: string;
}> = ({ titulo, valor, variacion, positivo, vsText }) => (
  <div style={estilos.tarjetaKPI}>
    <div style={estilos.tituloKPI}>{titulo}</div>
    <div style={estilos.valorKPI}>{valor}</div>
    <div style={{ fontSize: '0.8125rem', fontWeight: 600, color: positivo ? '#10b981' : '#ef4444' }}>
      {positivo ? '\u25B2' : '\u25BC'} {variacion} {vsText}
    </div>
  </div>
);

const obtenerColorEstado = (estado: string): React.CSSProperties => {
  const colores: Record<string, { bg: string; texto: string }> = {
    Completada: { bg: '#d1fae5', texto: '#065f46' },
    Completed: { bg: '#d1fae5', texto: '#065f46' },
    Pendiente: { bg: '#fef3c7', texto: '#92400e' },
    Pending: { bg: '#fef3c7', texto: '#92400e' },
    'En proceso': { bg: '#dbeafe', texto: '#1e40af' },
    'In progress': { bg: '#dbeafe', texto: '#1e40af' },
  };
  const color = colores[estado] || { bg: '#f3f4f6', texto: '#374151' };
  return {
    display: 'inline-block',
    padding: '0.25rem 0.625rem',
    borderRadius: '9999px',
    fontSize: '0.75rem',
    fontWeight: 600,
    backgroundColor: color.bg,
    color: color.texto,
  };
};

const App: React.FC = () => {
  const [lang, setLang] = useState<Lang>(detectLang);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setLang(detectLang());
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
    return () => observer.disconnect();
  }, []);

  const t = translations[lang];

  const datosKPI = [
    { titulo: t.totalIncome, valor: '€1.245.320', variacion: '+12.5%', positivo: true },
    { titulo: t.opExpenses, valor: '€387.210', variacion: '+3.2%', positivo: false },
    { titulo: t.netProfit, valor: '€858.110', variacion: '+18.7%', positivo: true },
    { titulo: t.activeClients, valor: '2.847', variacion: '+5.1%', positivo: true },
  ];

  const transacciones = [
    { id: 'TXN-001', fecha: '2026-04-10', concepto: t.txSepa, importe: '€15.200', estado: t.completed },
    { id: 'TXN-002', fecha: '2026-04-10', concepto: t.txPayroll, importe: '€42.800', estado: t.completed },
    { id: 'TXN-003', fecha: '2026-04-09', concepto: t.txInvoice, importe: '€8.350', estado: t.pending },
    { id: 'TXN-004', fecha: '2026-04-09', concepto: t.txFee, importe: '€120', estado: t.completed },
    { id: 'TXN-005', fecha: '2026-04-08', concepto: t.txInvestment, importe: '€50.000', estado: t.inProgress },
  ];

  return (
    <div style={estilos.contenedor}>
      <div style={estilos.encabezado}>{t.title}</div>
      <div style={estilos.subtitulo}>{t.subtitle}</div>
      <div style={estilos.cuadriculaKPI}>
        {datosKPI.map((kpi, i) => (
          <TarjetaKPI key={i} titulo={kpi.titulo} valor={kpi.valor} variacion={kpi.variacion} positivo={kpi.positivo} vsText={t.vsLastMonth} />
        ))}
      </div>
      <div style={estilos.tituloSeccion}>{t.recentTx}</div>
      <div style={{ overflowX: 'auto' as const, borderRadius: '0.75rem' }}>
        <table style={estilos.tabla}>
          <thead>
            <tr>
              <th style={estilos.celdaEncabezado}>{t.colId}</th>
              <th style={estilos.celdaEncabezado}>{t.colDate}</th>
              <th style={estilos.celdaEncabezado}>{t.colConcept}</th>
              <th style={estilos.celdaEncabezado}>{t.colAmount}</th>
              <th style={estilos.celdaEncabezado}>{t.colStatus}</th>
            </tr>
          </thead>
          <tbody>
            {transacciones.map((txn) => (
              <tr key={txn.id}>
                <td style={{ ...estilos.celda, fontFamily: 'monospace' }}>{txn.id}</td>
                <td style={estilos.celda}>{txn.fecha}</td>
                <td style={estilos.celda}>{txn.concepto}</td>
                <td style={{ ...estilos.celda, fontWeight: 600 }}>{txn.importe}</td>
                <td style={estilos.celda}>
                  <span style={obtenerColorEstado(txn.estado)}>{txn.estado}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default App;
