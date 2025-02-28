import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AppYearPickerInput } from '@/core/components/inputs/dates/AppYearPickerInput';

const meta = {
  component: AppYearPickerInput,
  args: {
    name: 'Year picker input',
    value: undefined,
    onChange: fn(),
    onBlur: fn(),
    errors: undefined,
    label: undefined,
    helper: undefined,
  },
} satisfies Meta<typeof AppYearPickerInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: 'Year picker',
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
    placeholder: 'Select a year (placeholder)',
  },
};
