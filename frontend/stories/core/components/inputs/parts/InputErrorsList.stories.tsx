import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputErrorsList } from '@/components/shared/inputs/parts/InputErrorsList';

const meta = {
  component: InputErrorsList,
} satisfies Meta<typeof InputErrorsList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    errors: ['Validation error #1', 'Validation error #2', 'Validation error #3'],
  },
};
