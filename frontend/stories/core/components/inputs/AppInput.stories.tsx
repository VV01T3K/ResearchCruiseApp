import { withControlledValue } from '@stories/decorators/withControlledValue';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn } from 'storybook/test';

import { AppInput } from '@/components/shared/inputs/AppInput';

const meta = {
  decorators: [withControlledValue],
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

export const EmptyText: Story = {
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, 'Cruise');
    await expect(input).toHaveValue('Cruise');
    await userEvent.clear(input);
    await expect(input).toHaveValue('');
  },
};

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

function IndependentInput(props: React.ComponentProps<typeof AppInput>) {
  const [value, setValue] = useState(props.value);
  return (
    <AppInput
      {...props}
      value={value}
      onChange={(nextValue) => {
        props.onChange?.(nextValue);
        setValue(nextValue);
      }}
    />
  );
}

export const DuplicateFieldNames: Story = {
  render: (args) => (
    <div className="space-y-4">
      <IndependentInput {...args} label="First field" />
      <IndependentInput {...args} label="Second field" />
    </div>
  ),
  play: async ({ args, canvas, userEvent }) => {
    const first = canvas.getByLabelText('First field');
    const second = canvas.getByLabelText('Second field');
    await expect(first).not.toBe(second);
    await userEvent.click(canvas.getByText('Second field'));
    await expect(second).toHaveFocus();
    await userEvent.type(first, 'Alpha');
    await expect(first).toHaveValue('Alpha');
    await expect(second).toHaveValue('');
    await expect(args.onChange).toHaveBeenLastCalledWith('Alpha');
  },
};
