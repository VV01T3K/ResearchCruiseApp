import { withControlledValue } from '@stories/decorators/withControlledValue';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';

import { DatePickerInput } from '@/components/shared/inputs/dates/DatePickerInput';

const meta = {
  decorators: [withControlledValue],
  component: DatePickerInput,
  args: {
    name: 'Date picker input',
    value: undefined,
    onChange: fn(),
    onBlur: fn(),
    errors: undefined,
    label: undefined,
    helper: undefined,
  },
} satisfies Meta<typeof DatePickerInput>;

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

    await userEvent.click(trigger);
    await page.findByRole('dialog', { name: 'Wybierz datę' });
    await userEvent.click(trigger.querySelector('svg')!);
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(args.onBlur).toHaveBeenCalledTimes(2);
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
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Wybierz datę' }));
    const calendar = await within(canvasElement.ownerDocument.body).findByRole('dialog', { name: 'Wybierz datę' });
    const time = within(calendar).getByRole('group', { name: 'Godzina' });
    await expect(within(time).queryByRole('spinbutton')).not.toBeInTheDocument();
    await expect(within(time).getByRole('button', { name: 'Wybierz godzinę z listy' })).toBeDisabled();
    await userEvent.click(within(calendar).getByRole('button', { name: '15' }));
    await userEvent.click(within(time).getByRole('spinbutton', { name: 'godzina' }));
    await userEvent.keyboard('0830{Enter}');
    await expect(canvas.getByText(/^15\.\d\d\.\d{4}, 08:30$/)).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(calendar).not.toBeInTheDocument());
  },
};

export const WithSeparateTime: Story = {
  args: {
    type: 'datetime',
    label: 'Data rozpoczęcia rejsu',
    timeLabel: 'Godzina rozpoczęcia rejsu',
  },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const time = canvas.getByRole('group', { name: 'Godzina rozpoczęcia rejsu' });
    await expect(canvas.getByText('Godzina', { exact: true })).toBeVisible();
    await expect(within(time).queryByRole('spinbutton')).not.toBeInTheDocument();
    await userEvent.click(canvas.getByRole('button', { name: /^Data rozpoczęcia rejsu:/ }));
    const calendar = await within(canvasElement.ownerDocument.body).findByRole('dialog', { name: 'Wybierz datę' });
    await expect(within(calendar).queryByRole('group', { name: /Godzina/ })).not.toBeInTheDocument();
    await userEvent.click(within(calendar).getByRole('button', { name: '15' }));
    await expect(calendar).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(calendar).not.toBeInTheDocument());
    await userEvent.click(within(time).getByRole('spinbutton', { name: 'godzina' }));
    await userEvent.keyboard('0830{Enter}');
    await expect(args.onChange).toHaveBeenCalled();
    await expect(within(time).getByRole('spinbutton', { name: 'godzina' })).toHaveAttribute('aria-valuenow', '8');
    await expect(canvas.getByRole('button', { name: /^Data rozpoczęcia rejsu: 15\.\d\d\.\d{4}$/ })).toBeInTheDocument();
  },
};

export const SelectedDayFitsItsCell: Story = {
  args: {
    value: '2026-05-17',
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: /17\.05\.2026/ }));
    const calendar = await within(canvasElement.ownerDocument.body).findByRole('dialog', { name: 'Wybierz datę' });
    await waitFor(() => expect(calendar.getAnimations()).toHaveLength(0));
    for (const day of ['11', '12', '13', '14', '15', '16', '17']) {
      const button = within(calendar).getByRole('button', { name: day });
      await userEvent.click(button);
      const popup = calendar.getBoundingClientRect();
      const cell = button.parentElement!.getBoundingClientRect();
      const circle = button.getBoundingClientRect();
      await expect(circle.left).toBeGreaterThanOrEqual(Math.max(popup.left, cell.left));
      await expect(circle.right).toBeLessThanOrEqual(Math.min(popup.right, cell.right));
      await expect(Math.abs(circle.left + circle.right - cell.left - cell.right) / 2).toBeLessThan(0.5);
    }
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(calendar).not.toBeInTheDocument());
  },
};
