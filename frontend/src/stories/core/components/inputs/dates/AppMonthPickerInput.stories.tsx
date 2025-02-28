import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AppMonthPickerInput } from '@/core/components/inputs/dates/AppMonthPickerInput';

const meta = {
  component: AppMonthPickerInput,
  args: {
    name: 'Month picker input',
    value: undefined,
    onChange: fn(),
    onBlur: fn(),
    errors: undefined,
    label: undefined,
    helper: undefined,
  },
} satisfies Meta<typeof AppMonthPickerInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: 'Month picker',
  },
};

export const WithErrors: Story = {
  args: {
    errors: ['Something went wrong'],
  },
};

export const WithHelper: Story = {
  args: {
    helper: 'Some helper text',
  },
};

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

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Select a month (placeholder)',
  },
};
