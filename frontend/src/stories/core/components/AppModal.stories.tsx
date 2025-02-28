import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AppModal } from '@/core/components/AppModal';
import AppBackground from '@/core/components/layout/AppBackground';

const meta = {
  component: AppModal,
  args: {
    children: <div className="min-h-80 bg-gray-100 rounded-2xl" />,
    onClose: fn(),
  },
  decorators: [
    (Story) => (
      <div className="h-160">
        <AppBackground />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppModal>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Modal',
    isOpen: true,
  },
};
