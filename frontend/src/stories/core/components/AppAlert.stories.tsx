import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AppAlert } from '@/core/components/AppAlert';

const meta = {
  component: AppAlert,
  args: {
    children: 'Alert',
  },
} satisfies Meta<typeof AppAlert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    children: 'Primary Alert',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success Alert',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger Alert',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning Alert',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info Alert',
  },
};

export const Closeable: Story = {
  args: {
    onClose: fn(),
    children: 'Closeable Alert',
  },
};
