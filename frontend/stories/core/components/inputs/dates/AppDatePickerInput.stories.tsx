import { withControlledValue } from '@stories/decorators/withControlledValue';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';

import { AppDatePickerInput } from '@/components/shared/inputs/dates/AppDatePickerInput';

const meta = {
  decorators: [withControlledValue],
  component: AppDatePickerInput,
  args: {
    name: 'Date picker input',
    value: undefined,
    onChange: fn(),
    onBlur: fn(),
    errors: undefined,
    label: undefined,
    helper: undefined,
  },
} satisfies Meta<typeof AppDatePickerInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: 'Wybierz datę' });
    await userEvent.click(trigger);
    const calendar = await page.findByRole('dialog', { name: 'Wybierz datę' });
    await waitFor(() => expect(calendar).toBeVisible());

    await userEvent.click(within(calendar).getByRole('button', { name: /^\d\d\.\d{4}$/ }));
    await page.findByRole('dialog', { name: 'Wybierz miesiąc' });
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page.queryByRole('dialog', { name: 'Wybierz miesiąc' })).not.toBeInTheDocument());
    await waitFor(() => expect(calendar).toBeVisible());
    await userEvent.click(within(calendar).getByRole('button', { name: /^\d\d\.\d{4}$/ }));
    await userEvent.click(await page.findByRole('button', { name: 'Marzec' }));
    await waitFor(() => expect(within(calendar).getByRole('button', { name: /^03\.\d{4}$/ })).toBeVisible());

    await userEvent.click(within(calendar).getByRole('button', { name: '10' }));
    await userEvent.click(within(calendar).getByRole('button', { name: '12' }));
    await expect(trigger).toHaveTextContent(/^12\.03\./);
    await expect(calendar).toBeVisible();
    await expect(args.onBlur).not.toHaveBeenCalled();

    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
    await expect(args.onBlur).toHaveBeenCalledOnce();

    await userEvent.click(trigger);
    await page.findByRole('dialog', { name: 'Wybierz datę' });
    await userEvent.click(canvasElement.ownerDocument.body);
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(trigger).toHaveFocus();
  },
};

export const Clearable: Story = {
  args: { value: '2026-01-15T00:00:00.000Z' },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body);
    const trigger = canvas.getByRole('button', { name: /^15\.01\.2026/ });
    const clear = canvas.getByRole('button', { name: 'Wyczyść datę' });
    await expect(clear.parentElement?.closest('button')).toBeNull();
    await userEvent.click(trigger);
    await page.findByRole('dialog', { name: 'Wybierz datę' });
    await userEvent.click(clear);
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(canvas.queryByRole('button', { name: 'Wyczyść datę' })).not.toBeInTheDocument();
    await expect(trigger).toHaveTextContent('Wybierz datę');
    await expect(trigger).toHaveFocus();
    await expect(args.onBlur).toHaveBeenCalledOnce();
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Date picker',
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
    placeholder: 'Select a date (placeholder)',
  },
};

export const WithSelectionStart: Story = {
  args: {
    selectionStartDate: new Date(2026, 0, 15),
  },
};

export const WithMinimum: Story = {
  args: {
    minimalDate: new Date(2026, 0, 15),
  },
};

export const WithMaximum: Story = {
  args: {
    maximalDate: new Date(2026, 0, 15),
  },
};

export const WithTime: Story = {
  args: {
    type: 'datetime',
  },
};

export const WithTimeStep: Story = {
  args: {
    type: 'datetime',
    minuteStep: 30,
  },
};
