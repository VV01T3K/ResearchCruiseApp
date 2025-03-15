import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AppDatePickerInput } from '@/core/components/inputs/dates/AppDatePickerInput';

const meta = {
  component: AppDatePickerInput,
  args: {
    name: 'Date picker input',
    value: undefined,
    onChange: fn(),
    onBlur: fn(),
    errors: undefined,
    label: undefined,
    helper: undefined,
  },
} satisfies Meta<typeof AppDatePickerInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: 'Date picker',
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
    placeholder: 'Select a date (placeholder)',
  },
};

export const WithSelectionStart: Story = {
  args: {
    selectionStartDate: new Date(),
  },
};

export const WithMinimum: Story = {
  args: {
    minimalDate: new Date(),
  },
};

export const WithMaximum: Story = {
  args: {
    maximalDate: new Date(),
  },
};

export const WithTime: Story = {
  args: {
    type: 'datetime',
  },
};

export const WithTimeStep: Story = {
  args: {
    type: 'datetime',
    minuteStep: 30,
  },
};
