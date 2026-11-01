import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputErrorTriangle } from '@/components/shared/inputs/parts/InputErrorTriangle';

const meta = {
  component: InputErrorTriangle,
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof InputErrorTriangle>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    errors: ['Any'],
  },
};
