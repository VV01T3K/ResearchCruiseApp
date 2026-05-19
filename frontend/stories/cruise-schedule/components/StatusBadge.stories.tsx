import type { Meta, StoryObj } from '@storybook/react-vite';

import { StatusBadge } from '@/routes/_authed/cruises/-components/StatusBadge';

const meta = {
  component: StatusBadge,
} satisfies Meta<typeof StatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Nowy: Story = {
  args: {
    status: 'Nowy',
  },
};

export const Potwierdzony: Story = {
  args: {
    status: 'Potwierdzony',
  },
};

export const Zakonczony: Story = {
  args: {
    status: 'Zakończony',
  },
};
