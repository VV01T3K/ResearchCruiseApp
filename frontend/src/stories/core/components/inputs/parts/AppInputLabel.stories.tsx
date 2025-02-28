import type { Meta, StoryObj } from '@storybook/react';

import { AppInputLabel } from '@/core/components/inputs/parts/AppInputLabel';

const meta = {
  component: AppInputLabel,
} satisfies Meta<typeof AppInputLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Label',
    label: 'Label',
  },
};
