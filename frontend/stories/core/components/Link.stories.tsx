import type { Meta, StoryObj } from '@storybook/react-vite';

import { Link } from '@/components/shared/Link';

const meta = {
  component: Link,
  args: {
    href: '/link',
  },
} satisfies Meta<typeof Link>;

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
