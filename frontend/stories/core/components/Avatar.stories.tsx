import type { Meta, StoryObj } from '@storybook/react-vite';

import { Avatar } from '@/components/shared/Avatar';

const meta = {
  component: Avatar,
} satisfies Meta<typeof Avatar>;

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
