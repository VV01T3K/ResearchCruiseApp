import { MockRouterProvider } from '@stories/mocks/MockRouterProvider';
import type { Meta, StoryObj } from '@storybook/react';

import { AppButton } from '@/core/components/AppButton';
import { AppCalendar } from '@/core/components/calendar/AppCalendar';

const meta = {
  component: AppCalendar,
  args: {
    events: [
      {
        title: 'Event 1',
        start: new Date(),
        end: new Date(),
      },
      {
        title: 'Event 2',
        start: new Date(Date.now() - 1000 * 60 * 60 * 24),
        end: new Date(Date.now() + 1000 * 60 * 60 * 24),
      },
      {
        title: 'Event 3',
        start: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
        end: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2),
      },
    ],
  },
} satisfies Meta<typeof AppCalendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithButtons: Story = {
  args: {
    buttons: (prev) => [<AppButton key="custom">Custom button</AppButton>, ...prev],
  },
};

export const WithLink: Story = {
  args: {
    events: [
      {
        title: 'Event with link',
        start: new Date(),
        end: new Date(),
        link: '/link',
      },
    ],
  },
  decorators: [
    (Story) => (
      <MockRouterProvider>
        <Story />
      </MockRouterProvider>
    ),
  ],
};
