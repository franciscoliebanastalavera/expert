import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapTableComponent } from './cap-table.component';
import { CapTableColumn } from './cap-table.types';

interface TransactionRow {
  id: number;
  fecha: string;
  tipo: string;
  importe: string;
  estado: string;
}

const meta: Meta<CapTableComponent<TransactionRow>> = {
  title: 'Components/CapTable',
  component: CapTableComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapTableComponent],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CapTableComponent<TransactionRow>>;

const columns: CapTableColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'fecha', label: 'Fecha' },
  { key: 'tipo', label: 'Tipo' },
  { key: 'importe', label: 'Importe' },
  { key: 'estado', label: 'Estado' },
];

const sampleRows: TransactionRow[] = [
  { id: 1, fecha: '01/05/2026', tipo: 'Transferencia SEPA', importe: '1.500,00 €', estado: 'Completada' },
  { id: 2, fecha: '02/05/2026', tipo: 'Pago Nómina', importe: '-2.000,00 €', estado: 'Pendiente' },
  { id: 3, fecha: '03/05/2026', tipo: 'Cobro Factura', importe: '500,00 €', estado: 'Completada' },
  { id: 4, fecha: '04/05/2026', tipo: 'Domiciliación', importe: '-150,00 €', estado: 'Procesando' },
  { id: 5, fecha: '05/05/2026', tipo: 'Ingreso Cliente', importe: '3.200,00 €', estado: 'Completada' },
];

export const Default: Story = {
  args: {
    columns,
    data: sampleRows,
  },
};

export const Empty: Story = {
  args: {
    columns,
    data: [],
  },
};
