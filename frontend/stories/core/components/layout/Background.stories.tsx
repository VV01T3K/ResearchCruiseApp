import type { Meta, StoryObj } from '@storybook/react-vite';

import Background from '@/components/shared/layout/Background';

const meta = {
  component: Background,
  decorators: [
    (Story) => (
      <div className="h-screen">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Background>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
