import type { Meta, StoryObj } from '@storybook/react-vite';

import AppBackground from '@/components/shared/layout/AppBackground';

const meta = {
  component: AppBackground,
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppBackground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
