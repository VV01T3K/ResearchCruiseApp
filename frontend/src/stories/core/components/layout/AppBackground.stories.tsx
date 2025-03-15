import { MockRouterProvider } from '@stories/mocks/MockRouterProvider';
import type { Meta, StoryObj } from '@storybook/react';

import AppBackground from '@/core/components/layout/AppBackground';

const meta = {
  component: AppBackground,
  decorators: [
    (Story) => (
      <MockRouterProvider>
        <div className="h-screen">
          <Story />
        </div>
      </MockRouterProvider>
    ),
  ],
} satisfies Meta<typeof AppBackground>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
