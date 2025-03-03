import type { Meta, StoryObj } from '@storybook/react';

import { AppLayout } from '@/core/components/AppLayout';
import AppBackground from '@/core/components/layout/AppBackground';

const meta = {
  component: AppLayout,
  args: {
    children: <div className="min-h-80 bg-gray-100 rounded-2xl" />,
  },
  decorators: [
    (Story) => (
      <>
        <AppBackground />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof AppLayout>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    variant: 'default',
    title: 'Default',
  },
};

export const Narrow: Story = {
  args: {
    variant: 'narrow',
    title: 'Narrow',
  },
};

export const DefaultWithCentering: Story = {
  args: {
    variant: 'defaultWithCentering',
    title: 'Default without centering',
  },
};

export const WithDescription: Story = {
  args: {
    title: 'With description',
    description: 'This is a description',
  },
};
