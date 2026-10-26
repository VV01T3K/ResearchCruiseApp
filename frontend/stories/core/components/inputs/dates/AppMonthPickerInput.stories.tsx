import { withControlledValue } from '@stories/decorators/withControlledValue';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';

import { AppMonthPickerInput } from '@/components/shared/inputs/dates/AppMonthPickerInput';

const meta = {
  decorators: [withControlledValue],
  component: AppMonthPickerInput,
  args: {
    name: 'Month picker input',
    value: undefined,
    onChange: fn(),
    onBlur: fn(),
    errors: undefined,
    label: undefined,
    helper: undefined,
  },
} satisfies Meta<typeof AppMonthPickerInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Clearable: Story = {
  args: { value: '2026-03-01T00:00:00.000Z' },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: /^03\.2026/ });
    await userEvent.click(trigger);
    await page.findByRole('dialog', { name: 'Wybierz miesiąc' });
    await userEvent.click(canvas.getByRole('button', { name: 'Wyczyść miesiąc' }));
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveTextContent('Wybierz miesiąc');
    await expect(trigger).toHaveFocus();
    await expect(args.onBlur).toHaveBeenCalledOnce();
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Month picker',
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

export const WithPlaceholder: Story = {
  args: {
    placeholder: 'Select a month (placeholder)',
  },
};
