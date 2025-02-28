import { MockRouterProvider } from '@stories/mocks/MockRouterProvider';
import type { Meta, StoryObj } from '@storybook/react';

import { AppLink } from '@/core/components/AppLink';

const meta = {
  component: AppLink,
  decorators: [
    (Story) => (
      <MockRouterProvider>
        <Story />
      </MockRouterProvider>
    ),
  ],
  args: {
    href: '/link',
  },
} satisfies Meta<typeof AppLink>;

export default meta;

type Story = StoryObj<typeof meta>;

export const RouterLink: Story = {
  args: {
    children: 'Router link',
  },
};

export const ExternalLink: Story = {
  args: {
    children: 'External link',
    href: 'https://google.com',
    target: '_blank',
  },
};

export const Plain: Story = {
  args: {
    children: 'Plain link',
    variant: 'plain',
  },
};
