import { withControlledValue } from '@stories/decorators/withControlledValue';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';

import { TimePickerInput } from '@/components/shared/inputs/dates/TimePickerInput';

const meta = {
  decorators: [withControlledValue],
  component: TimePickerInput,
  args: {
    name: 'Time picker input',
    value: { hours: 12, minutes: 30 },
    onChange: fn(),
    onBlur: fn(),
    errors: undefined,
    'aria-label': 'Godzina',
  },
} satisfies Meta<typeof TimePickerInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLabel: Story = {
  args: {
    label: 'Time picker',
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
  play: async ({ args, canvas, userEvent }) => {
    const hours = canvas.getByRole('spinbutton', { name: 'godzina' });
    await userEvent.tab();
    await expect(hours).not.toHaveFocus();
    await userEvent.click(hours);
    await userEvent.keyboard('0930{Enter}');
    await expect(hours).not.toHaveFocus();
    await expect(hours).toHaveAttribute('aria-valuenow', '12');
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(canvas.getByRole('button', { name: 'Wybierz godzinę z listy' })).toBeDisabled();
  },
};

export const WithPlaceholder: Story = {
  args: {
    value: undefined,
    disabled: true,
    placeholder: 'Nie podano',
  },
};

export const WithMinimalTime: Story = {
  args: {
    value: { hours: 16, minutes: 0 },
    minimalTime: { hours: 15, minutes: 30 },
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('spinbutton', { name: 'godzina' }));
    await userEvent.keyboard('1520{Enter}');
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(canvas.getByRole('spinbutton', { name: 'godzina' })).toHaveAttribute('aria-valuenow', '16');
    await expect(canvas.getByRole('spinbutton', { name: 'godzina' })).toHaveAttribute('aria-invalid', 'true');
  },
};

export const WithMaximalTime: Story = {
  args: {
    maximalTime: { hours: 20, minutes: 0 },
  },
};

export const NoTimeLeftAfterMinimalTime: Story = {
  args: {
    value: undefined,
    minimalTime: { hours: 23, minutes: 45 },
  },
  play: async ({ args, canvas, userEvent }) => {
    await userEvent.click(canvas.getByRole('spinbutton', { name: 'godzina' }));
    await userEvent.keyboard('2359{Enter}');
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(canvas.getByRole('spinbutton', { name: 'godzina' })).toHaveAttribute('aria-invalid', 'true');
  },
};

export const TypingAndArrows: Story = {
  args: {
    value: undefined,
    clearable: true,
  },
  play: async ({ args, canvas, userEvent }) => {
    const hours = canvas.getByRole('spinbutton', { name: 'godzina' });
    const minutes = canvas.getByRole('spinbutton', { name: 'minuty' });
    await userEvent.click(hours);
    await userEvent.keyboard('083');
    await expect(minutes).toHaveFocus();
    await userEvent.keyboard('0{Enter}');
    await expect(args.onChange).toHaveBeenLastCalledWith({ hours: 8, minutes: 30 });
    await userEvent.keyboard('{ArrowUp}{ArrowLeft}{ArrowDown}{Enter}');
    await expect(args.onChange).toHaveBeenLastCalledWith({ hours: 7, minutes: 0 });
    await userEvent.keyboard('15{Escape}');
    await expect(hours).toHaveAttribute('aria-valuenow', '7');
    await userEvent.keyboard('{Backspace}{Enter}');
    await expect(args.onChange).toHaveBeenLastCalledWith({ hours: 7, minutes: 0 });
    await userEvent.click(canvas.getByRole('button', { name: 'Wyczyść godzinę' }));
    await expect(args.onChange).toHaveBeenLastCalledWith(undefined);
  },
};

export const OffStepTime: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const hours = canvas.getByRole('spinbutton', { name: 'godzina' });
    await userEvent.click(hours);
    await userEvent.keyboard('0815{Enter}');
    await expect(args.onChange).not.toHaveBeenCalled();
    await expect(hours).toHaveAttribute('aria-invalid', 'true');
    await expect(hours).toHaveAttribute('aria-valuenow', '12');
  },
};

export const PickingFromList: Story = {
  args: {
    value: undefined,
  },
  play: async ({ args, canvas, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(canvas.getByRole('button', { name: 'Wybierz godzinę z listy' }));
    const picker = await page.findByRole('dialog', { name: 'Wybierz godzinę' });
    const minutes = within(picker).getByRole('group', { name: 'Minuty' });
    await expect(within(minutes).getAllByRole('button')).toHaveLength(2);
    await expect(within(minutes).getByRole('button', { name: '30' })).toBeDisabled();
    await userEvent.click(within(picker).getByRole('button', { name: '14' }));
    await expect(picker).toBeInTheDocument();
    await expect(args.onChange).not.toHaveBeenCalled();
    await userEvent.click(within(minutes).getByRole('button', { name: '30' }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ hours: 14, minutes: 30 });
    await expect(args.onBlur).toHaveBeenCalled();
    await waitFor(() => expect(picker).not.toBeInTheDocument());

    await userEvent.click(canvas.getByRole('button', { name: 'Wybierz godzinę z listy' }));
    const again = await page.findByRole('dialog', { name: 'Wybierz godzinę' });
    await userEvent.click(within(again).getByRole('button', { name: '12:00' }));
    await expect(args.onChange).toHaveBeenLastCalledWith({ hours: 12, minutes: 0 });
    await waitFor(() => expect(again).not.toBeInTheDocument());
  },
};
