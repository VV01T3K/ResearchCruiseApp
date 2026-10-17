import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusBadge } from '@/routes/cruises/-components/StatusBadge';

const meta = {
  component: StatusBadge,
} satisfies Meta<typeof StatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Nowy: Story = {
  args: {
    status: 'new',
  },
};

export const Potwierdzony: Story = {
  args: {
    status: 'confirmed',
  },
};

export const Zakonczony: Story = {
  args: {
    status: 'ended',
  },
};
