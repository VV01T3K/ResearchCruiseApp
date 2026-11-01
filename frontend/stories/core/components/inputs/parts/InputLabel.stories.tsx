import type { Meta, StoryObj } from '@storybook/react-vite';

import { InputLabel } from '@/components/shared/inputs/parts/InputLabel';

const meta = {
  component: InputLabel,
} satisfies Meta<typeof InputLabel>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    name: 'Label',
    value: 'Label',
  },
};
