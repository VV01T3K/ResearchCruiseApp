import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AppInput } from '@/core/components/inputs/AppInput';

const meta = {
  component: AppInput,
  args: {
    name: 'Input',
    value: '',
    errors: undefined,
    label: 'Input',
    helper: undefined,
    onChange: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof AppInput>;

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
    value: '12345678',
    label: 'Password',
    type: 'password',
  },
};

export const Email: Story = {
  args: {
    value: 'example@example.com',
    label: 'Email',
    type: 'email',
  },
};

export const EmptyTextarea: Story = {
  args: {
    value: '',
    label: 'Textarea',
    type: 'textarea',
  },
};

export const FilledTextarea: Story = {
  args: {
    value: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. '.repeat(20),
    label: 'Textarea',
    type: 'textarea',
  },
};

export const Disabled: Story = {
  args: {
    value: 'Disabled',
    label: 'Disabled',
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    name: 'name',
    value: '',
    label: 'Required',
    required: true,
  },
};

export const WithErrors: Story = {
  args: {
    value: 'Some string',
    errors: ['Error message'],
    label: 'With errors',
  },
};

export const WithHelper: Story = {
  args: {
    value: 'Some string',
    label: 'With helper',
    helper: 'Helper text',
  },
};
