/// <reference lib="webworker" />

interface ExportRow {
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

addEventListener('message', ({ data }: MessageEvent<ExportRow[]>) => {
  const headers = ['ID', 'Fecha', 'Tipo', 'Descripción', 'IBAN', 'Importe', 'Divisa', 'Estado', 'Categoría'];
  const csvRows = [headers.join(';')];

  for (const row of data) {
    csvRows.push([
      row.id,
      row.fecha,
      row.tipo,
      `"${row.descripcion}"`,
      row.iban,
      row.importe.toFixed(2),
      row.divisa,
      row.estado,
      row.categoria,
    ].join(';'));
  }

  const csvContent = csvRows.join('\n');
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  postMessage(blob);
});
