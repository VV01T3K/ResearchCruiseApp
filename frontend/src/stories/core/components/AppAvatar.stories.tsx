import type { Meta, StoryObj } from '@storybook/react';

import { AppAvatar } from '@/core/components/AppAvatar';

const meta = {
  component: AppAvatar,
} satisfies Meta<typeof AppAvatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    fullName: 'John A. Smith',
    variant: 'default',
  },
};

export const Small: Story = {
  args: {
    fullName: 'John Doe',
    variant: 'small',
  },
};
