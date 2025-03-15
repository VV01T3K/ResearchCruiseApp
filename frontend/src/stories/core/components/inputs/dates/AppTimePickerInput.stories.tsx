import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AppDatePickerTimeInput } from '@/core/components/inputs/dates/AppTimePickerInput';

const meta = {
  component: AppDatePickerTimeInput,
  args: {
    name: 'Time picker input',
    value: { hours: 12, minutes: 30 },
    onChange: fn(),
    onBlur: fn(),
    errors: undefined,
  },
} satisfies Meta<typeof AppDatePickerTimeInput>;

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
    value: undefined,
    placeholder: 'Select a time',
  },
};

export const WithMinuteStep: Story = {
  args: {
    minuteStep: 10,
  },
};
