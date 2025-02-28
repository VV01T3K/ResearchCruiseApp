import type { Meta, StoryObj } from '@storybook/react';

import { AppAccordion } from '../../../modules/core/components/AppAccordion';

const meta = {
  component: AppAccordion,
  args: {
    title: 'Accordion',
    children: <div>{'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(3)}</div>,
    expandedByDefault: true,
  },
} satisfies Meta<typeof AppAccordion>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Expanded: Story = {
  args: {
    title: 'Expanded Accordion',
  },
};

export const Collapsed: Story = {
  args: {
    title: 'Collapsed Accordion',
    expandedByDefault: undefined,
  },
};
