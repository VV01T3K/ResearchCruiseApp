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
  },
};

export const WithHelper: Story = {
  args: {
    helper: 'Helper text',
  },
};

export const ResyncsDraftOnValueChange: Story = {
  render: function Render() {
    const [value, setValue] = useState(1.001);
    return (
      <>
        <AppNumberInput name="resync" type="float" value={value} onChange={setValue} />
        {/* Keeps focus in the input, so its blur reformat cannot hide a missed resync. */}
        <button type="button" onMouseDown={(evt) => evt.preventDefault()} onClick={() => setValue(1.002)}>
          Set 1.002
        </button>
      </>
    );
  },
  play: async ({ canvas, userEvent }) => {
    const input = canvas.getByRole('textbox');
    await userEvent.type(input, '.');
    await expect(input).toHaveValue('1.');
    await userEvent.click(canvas.getByRole('button', { name: 'Set 1.002' }));
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
