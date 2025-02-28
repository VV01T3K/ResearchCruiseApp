import type { Meta, StoryObj } from '@storybook/react';

import { AppInputErrorTriangle } from '@/core/components/inputs/parts/AppInputErrorTriangle';

const meta = {
  component: AppInputErrorTriangle,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof AppInputErrorTriangle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    errors: ['Any'],
  },
};
