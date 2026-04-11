// Componente principal de Analytics con dashboard de datos mock
// Muestra tarjetas KPI y una tabla de transacciones recientes

import React from 'react';

// Datos mock para las tarjetas KPI
const datosKPI = [
  { titulo: 'Ingresos Totales', valor: '€1.245.320', variacion: '+12.5%', positivo: true },
  { titulo: 'Gastos Operativos', valor: '€387.210', variacion: '+3.2%', positivo: false },
  { titulo: 'Beneficio Neto', valor: '€858.110', variacion: '+18.7%', positivo: true },
  { titulo: 'Clientes Activos', valor: '2.847', variacion: '+5.1%', positivo: true },
];

// Datos mock para la tabla de transacciones recientes
const transacciones = [
  { id: 'TXN-001', fecha: '2026-04-10', concepto: 'Transferencia SEPA', importe: '€15.200', estado: 'Completada' },
  { id: 'TXN-002', fecha: '2026-04-10', concepto: 'Pago nominas', importe: '€42.800', estado: 'Completada' },
  { id: 'TXN-003', fecha: '2026-04-09', concepto: 'Cobro factura #892', importe: '€8.350', estado: 'Pendiente' },
  { id: 'TXN-004', fecha: '2026-04-09', concepto: 'Comision bancaria', importe: '€120', estado: 'Completada' },
  { id: 'TXN-005', fecha: '2026-04-08', concepto: 'Inversion fondo A', importe: '€50.000', estado: 'En proceso' },
];

// Estilos en linea para el dashboard (sin dependencias externas)
const estilos = {
  contenedor: {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '24px',
    backgroundColor: '#f4f6f9',
    minHeight: '100%',
    color: '#1a1a2e',
  } as React.CSSProperties,

  encabezado: {
    fontSize: '24px',
    fontWeight: 700,
    marginBottom: '8px',
    color: '#1a1a2e',
  } as React.CSSProperties,

  subtitulo: {
    fontSize: '14px',
    color: '#6b7280',
    marginBottom: '24px',
  } as React.CSSProperties,

  cuadriculaKPI: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
    gap: '16px',
    marginBottom: '32px',
  } as React.CSSProperties,

  tarjetaKPI: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    padding: '20px',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    border: '1px solid #e5e7eb',
  } as React.CSSProperties,

  tituloKPI: {
    fontSize: '13px',
    color: '#6b7280',
    marginBottom: '8px',
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  valorKPI: {
    fontSize: '28px',
    fontWeight: 700,
    marginBottom: '4px',
  } as React.CSSProperties,

  tabla: {
    width: '100%',
    borderCollapse: 'collapse' as const,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
  } as React.CSSProperties,

  celdaEncabezado: {
    textAlign: 'left' as const,
    padding: '14px 16px',
    backgroundColor: '#1a1a2e',
    color: '#ffffff',
    fontSize: '13px',
    fontWeight: 600,
    textTransform: 'uppercase' as const,
    letterSpacing: '0.5px',
  } as React.CSSProperties,

  celda: {
    padding: '12px 16px',
    borderBottom: '1px solid #f0f0f0',
    fontSize: '14px',
  } as React.CSSProperties,

  tituloSeccion: {
    fontSize: '18px',
    fontWeight: 600,
    marginBottom: '16px',
    color: '#1a1a2e',
  } as React.CSSProperties,
};

// Componente para una tarjeta KPI individual
const TarjetaKPI: React.FC<{
  titulo: string;
  valor: string;
  variacion: string;
  positivo: boolean;
}> = ({ titulo, valor, variacion, positivo }) => (
  <div style={estilos.tarjetaKPI}>
    <div style={estilos.tituloKPI}>{titulo}</div>
    <div style={estilos.valorKPI}>{valor}</div>
    <div style={{
      fontSize: '13px',
      fontWeight: 600,
      color: positivo ? '#10b981' : '#ef4444',
    }}>
      {/* Indicador visual de tendencia */}
      {positivo ? '\u25B2' : '\u25BC'} {variacion} vs. mes anterior
    </div>
  </div>
);

// Funcion auxiliar para obtener el color del estado de la transaccion
const obtenerColorEstado = (estado: string): React.CSSProperties => {
  const colores: Record<string, { bg: string; texto: string }> = {
    'Completada': { bg: '#d1fae5', texto: '#065f46' },
    'Pendiente': { bg: '#fef3c7', texto: '#92400e' },
    'En proceso': { bg: '#dbeafe', texto: '#1e40af' },
  };
  const color = colores[estado] || { bg: '#f3f4f6', texto: '#374151' };
  return {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '9999px',
    fontSize: '12px',
    fontWeight: 600,
    backgroundColor: color.bg,
    color: color.texto,
  };
};

// Componente principal del dashboard de Analytics
const App: React.FC = () => {
  return (
    <div style={estilos.contenedor}>
      {/* Cabecera del dashboard */}
      <div style={estilos.encabezado}>Dashboard de Analytics</div>
      <div style={estilos.subtitulo}>
        CapitalFlow - Resumen financiero en tiempo real
      </div>

      {/* Seccion de tarjetas KPI */}
      <div style={estilos.cuadriculaKPI}>
        {datosKPI.map((kpi, indice) => (
          <TarjetaKPI
            key={indice}
            titulo={kpi.titulo}
            valor={kpi.valor}
            variacion={kpi.variacion}
            positivo={kpi.positivo}
          />
        ))}
      </div>

      {/* Seccion de tabla de transacciones recientes */}
      <div style={estilos.tituloSeccion}>Transacciones Recientes</div>
      <table style={estilos.tabla}>
        <thead>
          <tr>
            <th style={estilos.celdaEncabezado}>ID</th>
            <th style={estilos.celdaEncabezado}>Fecha</th>
            <th style={estilos.celdaEncabezado}>Concepto</th>
            <th style={estilos.celdaEncabezado}>Importe</th>
            <th style={estilos.celdaEncabezado}>Estado</th>
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
  );
};

export default App;
