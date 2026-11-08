import type { Meta, StoryObj } from '@storybook/react-vite';

import { Anchor, Link } from '@/components/shared/Link';

const meta = {
  component: Link,
  args: {
    to: '/',
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
  render: () => (
    <Anchor href="https://google.com" target="_blank">
      External link
    </Anchor>
  ),
};

export const Plain: Story = {
  args: {
    children: 'Plain link',
    variant: 'plain',
  },
};
