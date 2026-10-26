import { withControlledValue } from '@stories/decorators/withControlledValue';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';

import { AppYearPickerInput } from '@/components/shared/inputs/dates/AppYearPickerInput';

const meta = {
  decorators: [withControlledValue],
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

export const Clearable: Story = {
  args: { value: 2026 },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: /^2026/ });
    await userEvent.click(trigger);
    await page.findByRole('dialog', { name: 'Wybierz rok' });
    await userEvent.click(canvas.getByRole('button', { name: 'Wyczyść rok' }));
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveTextContent('Wybierz rok');
    await expect(trigger).toHaveFocus();
    await expect(args.onBlur).toHaveBeenCalledOnce();
  },
};

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
  play: async ({ canvas, userEvent }) => {
    await userEvent.tab();
    await expect(canvas.getByRole('button')).not.toHaveFocus();
  },
};

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Select a year (placeholder)',
  },
};
