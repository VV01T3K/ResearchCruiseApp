import type { Meta, StoryObj } from '@storybook/react-vite';

import { Tabs } from '@/components/shared/Tabs';

const meta = {
  component: Tabs,
  args: {
    children: Array.from({ length: 4 }, (_, i) => `Tab ${i + 1}`),
    tabNames: Array.from({ length: 4 }, (_, i) => `Tab ${i + 1}`),
  },
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
