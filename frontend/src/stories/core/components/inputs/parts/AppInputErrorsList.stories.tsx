import type { Meta, StoryObj } from '@storybook/react';

import { AppInputErrorsList } from '@/core/components/inputs/parts/AppInputErrorsList';

const meta = {
  component: AppInputErrorsList,
} satisfies Meta<typeof AppInputErrorsList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    errors: ['Validation error #1', 'Validation error #2', 'Validation error #3'],
  },
};
