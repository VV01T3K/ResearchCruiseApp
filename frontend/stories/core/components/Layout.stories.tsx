import type { Meta, StoryObj } from '@storybook/react-vite';

import { Layout } from '@/components/shared/Layout';
import Background from '@/components/shared/layout/Background';

const meta = {
  component: Layout,
  args: {
    children: <div className="min-h-80 rounded-2xl bg-surface-subtle" />,
  },
  decorators: [
    (Story) => (
      <>
        <Background />
        <Story />
      </>
    ),
  ],
} satisfies Meta<typeof Layout>;

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
    title: 'Default with centering',
  },
};

export const WithDescription: Story = {
  args: {
    title: 'With description',
    description: 'This is a description',
  },
};
