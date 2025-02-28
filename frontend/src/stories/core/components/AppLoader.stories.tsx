import type { Meta, StoryObj } from '@storybook/react';

import { AppLoader } from '@/core/components/AppLoader';
import AppBackground from '@/core/components/layout/AppBackground';

const meta = {
  component: AppLoader,
  decorators: [
    (Story) => (
      <div className="h-100">
        <AppBackground />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
