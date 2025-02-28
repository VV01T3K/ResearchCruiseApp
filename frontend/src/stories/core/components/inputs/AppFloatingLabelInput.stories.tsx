import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AppFloatingLabelInput } from '@/core/components/inputs/AppFloatingLabelInput';

const meta = {
  component: AppFloatingLabelInput,
  args: {
    name: 'Text input',
    value: '',
    errors: undefined,
    label: 'Text input',
    helper: undefined,
    onChange: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof AppFloatingLabelInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const EmptyText: Story = {};

export const FilledText: Story = {
  args: {
    value: 'Some text',
  },
};

export const Password: Story = {
  args: {
    name: 'Password input',
    value: '12345678',
    type: 'password',
    label: 'Password input',
  },
};

export const Email: Story = {
  args: {
    name: 'Email input',
    value: 'example@example.com',
    type: 'email',
    label: 'Email input',
  },
};

export const Required: Story = {
  args: {
    name: 'Required input',
    label: 'Required input',
    required: true,
  },
};

export const DisabledEmpty: Story = {
  args: {
    name: 'Disabled input',
    label: 'Disabled input',
    disabled: true,
  },
};

export const DisabledFilled: Story = {
  args: {
    name: 'Disabled input',
    value: 'Some text',
    label: 'Disabled input',
    disabled: true,
  },
};

export const WithErrors: Story = {
  args: {
    name: 'Input with error',
    value: 'Some text',
    errors: ['Some error', 'Another error'],
    label: 'Input with error',
  },
};

export const WithHelper: Story = {
  args: {
    name: 'Input with helper',
    value: 'Some text',
    label: 'Input with helper',
    helper: 'Some helper text',
  },
};
