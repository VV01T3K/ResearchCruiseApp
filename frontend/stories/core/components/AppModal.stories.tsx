import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { expect, fn, waitFor, within } from 'storybook/test';

import { AppModal } from '@/components/shared/AppModal';
import { AppButton } from '@/components/shared/AppButton';
import AppBackground from '@/components/shared/layout/AppBackground';

const meta = {
  component: AppModal,
  parameters: {
    a11y: { test: 'error' },
    docs: {
      story: { inline: false },
    },
  },
  args: {
    children: <div className="min-h-80 rounded-2xl bg-gray-100" />,
    onClose: fn(),
  },
  render: (args) => <ModalExample {...args} key={String(args.isOpen)} />,
  decorators: [
    (Story) => (
      <div className="h-160">
        <AppBackground />
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof AppModal>;

function ModalExample(args: React.ComponentProps<typeof AppModal>) {
  const [isOpen, setIsOpen] = useState(args.isOpen);
  return (
    <>
      <AppButton onClick={() => setIsOpen(true)}>Open modal</AppButton>
      <AppModal
        {...args}
        isOpen={isOpen}
        onClose={() => {
          args.onClose();
          setIsOpen(false);
        }}
      />
    </>
  );
}

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Modal',
    isOpen: false,
  },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(await canvas.findByRole('button', { name: 'Open modal' }));
    const dialog = await page.findByRole('dialog', { name: 'Modal' });
    await userEvent.click(within(dialog).getByRole('button', { name: 'Zamknij' }));
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(await canvas.findByRole('button', { name: 'Open modal' })).toBeVisible();
    await userEvent.click(canvas.getByRole('button', { name: 'Open modal' }));
    await waitFor(() => expect(page.getByRole('dialog', { name: 'Modal' })).toBeVisible());
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(canvas.getByRole('button', { name: 'Open modal' })).toHaveFocus();
  },
};

export const LongContent: Story = {
  args: {
    title: 'Cruise details',
    isOpen: true,
    children: (
      <div className="space-y-4">
        {Array.from({ length: 12 }, (_, index) => (
          <p key={index}>
            Research task {index + 1}: collect water samples and record measurements at the designated station.
          </p>
        ))}
      </div>
    ),
  },
};
export const NonDismissible: Story = {
  args: {
    title: 'Action required',
    isOpen: true,
    dismissible: false,
    children: 'Complete the action before continuing.',
  },
  play: async ({ args, canvasElement, userEvent }) => {
    const dialog = await within(canvasElement.ownerDocument.body).findByRole('dialog', { name: 'Action required' });
    await expect(within(dialog).queryByRole('button')).not.toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    await expect(dialog).toBeVisible();
    await expect(args.onClose).not.toHaveBeenCalled();
  },
};

export const Stacked: Story = {
  args: {
    title: 'First',
    isOpen: true,
  },
  render: function Render(args) {
    const [open, setOpen] = useState({ first: true, second: true });
    return (
      <div id="root">
        <AppButton>Behind</AppButton>
        <AppModal {...args} title="First" isOpen={open.first} onClose={() => setOpen({ ...open, first: false })} />
        <AppModal {...args} title="Second" isOpen={open.second} onClose={() => setOpen({ ...open, second: false })}>
          <AppButton onClick={() => setOpen({ ...open, first: false })}>Close first</AppButton>
        </AppModal>
      </div>
    );
  },
  play: async ({ canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body);
    const root = canvasElement.querySelector('#root');
    await userEvent.click(
      within(await page.findByRole('dialog', { name: 'Second', hidden: true })).getByRole('button', {
        name: 'Close first',
        hidden: true,
      })
    );
    await waitFor(() => expect(page.queryByRole('dialog', { name: 'First', hidden: true })).not.toBeInTheDocument());
    await expect(root).toHaveAttribute('inert');
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(root).not.toHaveAttribute('inert');
  },
};
