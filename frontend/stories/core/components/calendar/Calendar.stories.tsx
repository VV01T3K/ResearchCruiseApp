import type { Meta, StoryObj } from '@storybook/react-vite';
import MockDate from 'mockdate';

import { Button } from '@/components/shared/Button';
import { Calendar } from '@/components/shared/calendar/Calendar';

const meta = {
  component: Calendar,
  args: {
    events: [
      {
        title: 'Event 1',
        start: new Date(2026, 0, 15),
        end: new Date(2026, 0, 15),
      },
      {
        title: 'Event 2',
        start: new Date(2026, 0, 14),
        end: new Date(2026, 0, 16),
      },
      {
        title: 'Event 3',
        start: new Date(2026, 0, 13),
        end: new Date(2026, 0, 17),
      },
    ],
  },
} satisfies Meta<typeof Calendar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const TodayOnSunday: Story = {
  beforeEach: () => MockDate.set('2026-01-18T12:00:00Z'),
};

export const WithButtons: Story = {
  args: {
    buttons: (prev) => [<Button key="custom">Custom button</Button>, ...prev],
  },
};

export const WithLink: Story = {
  args: {
    events: [
      {
        title: 'Event with link',
        start: new Date(2026, 0, 15),
        end: new Date(2026, 0, 15),
        link: '/link',
      },
    ],
  },
};
