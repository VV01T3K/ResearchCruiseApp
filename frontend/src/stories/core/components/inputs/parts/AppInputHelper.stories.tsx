import type { Meta, StoryObj } from '@storybook/react';

import { AppInputHelper } from '@/core/components/inputs/parts/AppInputHelper';

const meta = {
  component: AppInputHelper,
} satisfies Meta<typeof AppInputHelper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    helper: 'This is a helper text',
  },
};
