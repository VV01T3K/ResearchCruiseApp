import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';
import { useState } from 'react';

import { AppAlert } from '@/components/shared/AppAlert';
import { AppButton } from '@/components/shared/AppButton';

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
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Close' }));
    await expect(args.onClose).toHaveBeenCalledTimes(1);
    await expect(canvas.queryByRole('alert')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: 'Show alert' }));
    await expect(canvas.getByRole('alert')).toHaveTextContent('Closeable Alert');
  },
  render: function Render(args) {
    const [isOpen, setIsOpen] = useState(true);
    return isOpen ? (
      <AppAlert
        {...args}
        onClose={() => {
          args.onClose?.();
          setIsOpen(false);
        }}
      />
    ) : (
      <AppButton onClick={() => setIsOpen(true)}>Show alert</AppButton>
    );
  },
  args: {
    onClose: fn(),
    children: 'Closeable Alert',
  },
};
