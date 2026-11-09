import { withControlledValue } from '@stories/decorators/withControlledValue';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn } from 'storybook/test';

import { NumberInput } from '@/components/shared/inputs/NumberInput';

const meta = {
  decorators: [withControlledValue],
  component: NumberInput,
  args: {
    name: 'Numer input',
    'aria-label': 'Number input',
    value: 12,
    errors: undefined,
    label: undefined,
    helper: undefined,
    onChange: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof NumberInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
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
    'aria-label': undefined,
  },
};

export const WithHelper: Story = {
  args: {
    helper: 'Helper text',
  },
};

export const NotANumberValue: Story = {
  args: { value: NaN },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox')).toHaveValue('');
  },
};
