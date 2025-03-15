import type { Meta, StoryObj } from '@storybook/react';

import { AppTabs } from '@/core/components/AppTabs';

const meta = {
  component: AppTabs,
  args: {
    children: Array.from({ length: 4 }, (_, i) => `Tab ${i + 1}`),
    tabNames: Array.from({ length: 4 }, (_, i) => `Tab ${i + 1}`),
  },
} satisfies Meta<typeof AppTabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
