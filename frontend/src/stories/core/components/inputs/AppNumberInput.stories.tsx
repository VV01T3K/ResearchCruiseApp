import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AppNumberInput } from '@/core/components/inputs/AppNumberInput';

const meta = {
  component: AppNumberInput,
  args: {
    name: 'Numer input',
    value: 12,
    errors: undefined,
    label: undefined,
    helper: undefined,
    onChange: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof AppNumberInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const WithErrors: Story = {
  args: {
    errors: ['Error message'],
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Label',
  },
};

export const WithHelper: Story = {
  args: {
    helper: 'Helper text',
  },
};
