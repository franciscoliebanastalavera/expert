import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapTabsComponent } from './cap-tabs.component';
import { CapTabComponent } from './cap-tab/cap-tab.component';

const meta: Meta<CapTabsComponent> = {
  title: 'Components/CapTabs',
  component: CapTabsComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapTabsComponent, CapTabComponent],
    }),
  ],
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<CapTabsComponent>;

export const Default: Story = {
  render: () => ({
    template: `
      <cap-tabs>
        <cap-tab label="Resumen" [active]="true">
          <p style="padding: 1rem; color: var(--cap-text, #1e1e1e);">Contenido del tab Resumen</p>
        </cap-tab>
        <cap-tab label="Tesorería">
          <p style="padding: 1rem; color: var(--cap-text, #1e1e1e);">Contenido del tab Tesorería</p>
        </cap-tab>
        <cap-tab label="Pagos">
          <p style="padding: 1rem; color: var(--cap-text, #1e1e1e);">Contenido del tab Pagos</p>
        </cap-tab>
      </cap-tabs>
    `,
  }),
};
