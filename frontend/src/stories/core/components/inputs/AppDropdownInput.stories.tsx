import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AppDropdownInput } from '@/core/components/inputs/AppDropdownInput';

const stringOptions = [
  { value: 'first', inlineLabel: 'First string' },
  { value: 'second', inlineLabel: 'Second string' },
  { value: 'third', inlineLabel: 'Third string' },
];

const meta = {
  component: AppDropdownInput,
  args: {
    name: 'Dropdown input',
    value: '',
    allOptions: stringOptions,
    label: 'Dropdown input',
    allowEmptyOption: false,
    onChange: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof AppDropdownInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const String: Story = {
  args: {
    label: 'Dropdown string input',
  },
};

export const EmptyOption: Story = {
  args: {
    label: 'Dropdown input with empty option',
    allowEmptyOption: true,
  },
};

export const Disabled: Story = {
  args: {
    label: 'Disabled dropdown input',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    label: 'Required dropdown input',
    required: true,
  },
};

export const WithHelper: Story = {
  args: {
    label: 'Dropdown input with helper',
    helper: 'This is a helper text',
  },
};

export const WithErrors: Story = {
  args: {
    label: 'Dropdown input with errors',
    errors: ['This is an error message', 'This is another error message'],
  },
};

export const WithPlaceholder: Story = {
  args: {
    label: 'Dropdown input with placeholder',
    placeholder: 'Select an option (placeholder)',
    allowEmptyOption: true,
  },
};
