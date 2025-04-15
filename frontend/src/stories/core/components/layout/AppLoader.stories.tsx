import type { Meta, StoryObj } from '@storybook/react';

import { AppLoader } from '@/core/components/layout/AppLoader';

const meta = {
  component: AppLoader,
} satisfies Meta<typeof AppLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
