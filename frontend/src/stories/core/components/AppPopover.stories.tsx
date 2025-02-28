import type { Meta, StoryObj } from '@storybook/react';

import { AppButton } from '@/core/components/AppButton';
import { AppPopover } from '@/core/components/AppPopover';

const meta = {
  component: AppPopover,
  args: {
    children: 'Popover',
    modal: (setExpanded) => (
      <div className="flex flex-col gap-4 p-4">
        {'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam nec elit nec elit.'.repeat(5)}
        <AppButton onClick={() => setExpanded(false)}>Close</AppButton>
      </div>
    ),
  },
} satisfies Meta<typeof AppPopover>;

export default meta;

type Story = StoryObj<typeof meta>;

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

export const PrimaryOutline: Story = {
  args: {
    variant: 'primaryOutline',
  },
};

export const SuccessOutline: Story = {
  args: {
    variant: 'successOutline',
  },
};

export const DangerOutline: Story = {
  args: {
    variant: 'dangerOutline',
  },
};

export const WarningOutline: Story = {
  args: {
    variant: 'warningOutline',
  },
};

export const InfoOutline: Story = {
  args: {
    variant: 'infoOutline',
  },
};

export const Plain: Story = {
  args: {
    variant: 'plain',
  },
};
