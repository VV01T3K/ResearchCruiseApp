import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AppCheckbox } from '@/core/components/inputs/AppCheckbox';

const meta = {
  component: AppCheckbox,
  args: {
    name: 'Checkbox',
    checked: true,
    errors: undefined,
    label: undefined,
    helper: undefined,
    onBlur: fn(),
    onChange: fn(),
  },
  render: (props) => (
    <div className="flex gap-4">
      <AppCheckbox {...props} />
      <AppCheckbox {...props} checked={false} />
      <AppCheckbox {...props} checked={true} disabled />
      <AppCheckbox {...props} checked={false} disabled />
    </div>
  ),
} satisfies Meta<typeof AppCheckbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: 'Label',
  },
};

export const WithErrors: Story = {
  args: {
    label: 'Label',
    errors: ['Error message'],
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Label',
    helper: 'Helper message',
  },
};

export const Primary: Story = {
  args: {
    variant: 'primary',
  },
};

export const Success: Story = {
  args: {
    variant: 'success',
  },
};

export const Danger: Story = {
  args: {
    variant: 'danger',
  },
};

export const Warning: Story = {
  args: {
    variant: 'warning',
  },
};

export const Info: Story = {
  args: {
    variant: 'info',
  },
};

export const Plain: Story = {
  args: {
    variant: 'plain',
  },
};

export const ExtraSmall: Story = {
  args: {
    size: 'xs',
  },
};

export const Small: Story = {
  args: {
    size: 'sm',
  },
};

export const Medium: Story = {
  args: {
    size: 'md',
  },
};

export const Large: Story = {
  args: {
    size: 'lg',
  },
};

export const ExtraLarge: Story = {
  args: {
    size: 'xl',
  },
};
