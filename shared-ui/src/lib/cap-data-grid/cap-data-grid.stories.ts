import { Meta, StoryObj, moduleMetadata, applicationConfig } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapDataGridComponent } from './cap-data-grid.component';
import { CapTableColumn } from '../cap-table/cap-table.types';

interface DemoRow {
  id: number;
  name: string;
  value: number;
  status: string;
}

const meta: Meta<CapDataGridComponent<DemoRow>> = {
  title: 'Components/CapDataGrid',
  component: CapDataGridComponent,
  decorators: [
    applicationConfig({ providers: [] }),
    moduleMetadata({
      imports: [CommonModule, CapDataGridComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    itemSize: { control: 'number' },
    viewportHeight: { control: 'text' },
    trackByKey: { control: 'text' },
  },
};

export default meta;
type Story = StoryObj<CapDataGridComponent<DemoRow>>;

const columns: CapTableColumn[] = [
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Nombre' },
  { key: 'value', label: 'Importe' },
  { key: 'status', label: 'Estado' },
];

const STATUSES = ['Completada', 'Pendiente', 'Procesando', 'Rechazada'];

const buildRows = (count: number): DemoRow[] =>
  Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `Transacción ${i + 1}`,
    value: Math.round(Math.random() * 1_000_000) / 100,
    status: STATUSES[i % STATUSES.length],
  }));

export const Default: Story = {
  args: {
    columns,
    data: buildRows(50),
    itemSize: 48,
    viewportHeight: '400px',
    trackByKey: 'id',
  },
};

export const LargeDataset: Story = {
  args: {
    columns,
    data: buildRows(80_000),
    itemSize: 48,
    viewportHeight: '500px',
    trackByKey: 'id',
  },
  parameters: {
    docs: {
      description: {
        story:
          'Renders 80 000 rows backed by `cdk-virtual-scroll-viewport`. Only ~10-15 DOM nodes exist at any time; scrolling recycles them. This was the regulatory-report-table pain point in the briefing — 80k rows used to freeze the browser for ~18 seconds.',
      },
    },
  },
};
