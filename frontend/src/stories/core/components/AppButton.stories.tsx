import { MockRouterProvider } from '@stories/mocks/MockRouterProvider';
import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AppButton } from '@/core/components/AppButton';

const meta = {
  component: AppButton,
  args: {
    onClick: fn(),
  },
  render: (props) => (
    <div className="flex gap-4">
      <AppButton {...props} />
      <AppButton {...props} disabled />
    </div>
  ),
} satisfies Meta<typeof AppButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: 'primary',
    children: 'Primary',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
    children: 'Success',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
    children: 'Danger',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
    children: 'Warning',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
    children: 'Info',
  },
};

export const PrimaryOutline: Story = {
  args: {
    variant: 'primaryOutline',
    children: 'Primary Outline',
  },
};

export const SuccessOutline: Story = {
  args: {
    variant: 'successOutline',
    children: 'Success Outline',
  },
};

export const DangerOutline: Story = {
  args: {
    variant: 'dangerOutline',
    children: 'Danger Outline',
  },
};

export const WarningOutline: Story = {
  args: {
    variant: 'warningOutline',
    children: 'Warning Outline',
  },
};

export const InfoOutline: Story = {
  args: {
    variant: 'infoOutline',
    children: 'Info Outline',
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
    children: 'Extra Small',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
    children: 'Small',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
    children: 'Medium',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
    children: 'Large',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
    children: 'Extra Large',
  },
};

export const Plain: Story = {
  args: {
    variant: 'plain',
    size: 'plain',
    children: 'Plain',
  },
};

export const RouterLink: Story = {
  args: {
    type: 'link',
    children: 'Router Link',
    href: '/link',
  },
  decorators: [
    (Story) => (
      <MockRouterProvider>
        <Story />
      </MockRouterProvider>
    ),
  ],
};

export const ExternalLink: Story = {
  args: {
    type: 'link',
    href: 'https://google.com',
    target: '_blank',
    children: 'External Link',
  },
};
