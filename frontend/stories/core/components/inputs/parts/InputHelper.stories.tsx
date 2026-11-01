import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputHelper } from '@/components/shared/inputs/parts/InputHelper';

const meta = {
  component: InputHelper,
} satisfies Meta<typeof InputHelper>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    helper: 'This is a helper text',
  },
};
