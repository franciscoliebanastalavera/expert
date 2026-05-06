import { Meta, StoryObj, moduleMetadata } from '@storybook/angular';
import { CommonModule } from '@angular/common';
import { CapTabsComponent } from './cap-tabs.component';
import { CapTabComponent } from './cap-tab/cap-tab.component';

const meta: Meta = {
  title: 'Components/CapTabs',
  component: CapTabsComponent,
  decorators: [
    moduleMetadata({
      imports: [CommonModule, CapTabsComponent, CapTabComponent],
    }),
  ],
  tags: ['autodocs'],
  argTypes: {
    tabAlignment: { control: 'radio', options: ['left', 'center', 'right'] },
    tabMobile: { control: 'boolean' },
    variant: { control: 'radio', options: ['underline', 'card'] },
    tab1Label: { control: 'text', description: 'Label tab 1' },
    tab2Label: { control: 'text', description: 'Label tab 2' },
    tab3Label: { control: 'text', description: 'Label tab 3' },
    tabsChange: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj;

export const Default: Story = {
  args: {
    tabAlignment: 'left',
    tabMobile: false,
    variant: 'underline',
    tab1Label: 'Resumen',
    tab2Label: 'Tesorería',
    tab3Label: 'Pagos',
  },
  render: (args) => ({
    props: args,
    template: `
      <cap-tabs [tabAlignment]="tabAlignment" [tabMobile]="tabMobile" [variant]="variant">
        <cap-tab [label]="tab1Label" [active]="true">
          <p style="padding: 1rem; color: var(--cap-text, #1e1e1e);">Contenido de {{ tab1Label }}</p>
        </cap-tab>
        <cap-tab [label]="tab2Label">
          <p style="padding: 1rem; color: var(--cap-text, #1e1e1e);">Contenido de {{ tab2Label }}</p>
        </cap-tab>
        <cap-tab [label]="tab3Label">
          <p style="padding: 1rem; color: var(--cap-text, #1e1e1e);">Contenido de {{ tab3Label }}</p>
        </cap-tab>
      </cap-tabs>
    `,
  }),
};

export const Centered: Story = {
  args: {
    ...Default.args,
    tabAlignment: 'center',
  },
  render: Default.render,
};

export const Mobile: Story = {
  args: {
    ...Default.args,
    tabMobile: true,
  },
  render: Default.render,
};

export const Card: Story = {
  args: {
    ...Default.args,
    variant: 'card',
  },
  render: Default.render,
};
