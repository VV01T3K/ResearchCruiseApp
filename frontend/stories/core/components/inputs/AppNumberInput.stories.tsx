import { withControlledValue } from '@stories/decorators/withControlledValue';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn } from 'storybook/test';

import { AppNumberInput } from '@/components/shared/inputs/AppNumberInput';

const meta = {
  decorators: [withControlledValue],
  component: AppNumberInput,
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
} satisfies Meta<typeof AppNumberInput>;

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

export const ResyncsDraftOnTypeChange: Story = {
  render: function Render() {
    const [type, setType] = useState<'float' | 'integer'>('float');
    return (
      <>
        <AppNumberInput name="resync" aria-label="Resync" value={1} type={type as 'float'} />
        {/* Keeps focus in the input, so its blur reformat cannot hide a missed resync. */}
        <button type="button" onMouseDown={(evt) => evt.preventDefault()} onClick={() => setType('integer')}>
          Integer
        </button>
      </>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, '.');
    await expect(input).toHaveValue('1.');
    await userEvent.click(canvas.getByRole('button', { name: 'Integer' }));
    await expect(input).toHaveFocus();
    await expect(input).toHaveValue('1');
  },
};

export const NotANumberValue: Story = {
  args: { value: NaN },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('textbox')).toHaveValue('NaN');
  },
};
