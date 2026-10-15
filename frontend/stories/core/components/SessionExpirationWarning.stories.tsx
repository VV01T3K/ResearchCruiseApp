import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, within } from 'storybook/test';
import { SessionExpirationWarning } from '@/components/shared/SessionExpirationWarning';

const meta = {
  component: SessionExpirationWarning,
  args: {
    expirationDate: new Date('2026-01-15T12:04:00Z'),
    onRefreshSession: fn().mockResolvedValue(undefined),
    onSignOut: fn().mockResolvedValue(undefined),
  },
  parameters: {
    docs: {
      story: { inline: false },
      description: {
        component:
          'Appears in the final five minutes of a session. Refresh and sign-out are explicit actions; dismissing the dialog does not extend the session.',
      },
    },
  },
} satisfies Meta<typeof SessionExpirationWarning>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Expiring: Story = {};
export const Active: Story = { args: { expirationDate: new Date('2026-01-15T14:00:00Z') } };
export const Expired: Story = { args: { expirationDate: new Date('2026-01-15T11:59:00Z') } };
export const Refresh: Story = {
  play: async ({ args, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(await page.findByRole('button', { name: 'Odśwież sesję' }));
    await expect(args.onRefreshSession).toHaveBeenCalledTimes(1);
  },
};
export const SignOut: Story = {
  play: async ({ args, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(await page.findByRole('button', { name: 'Wyloguj' }));
    await expect(args.onSignOut).toHaveBeenCalledTimes(1);
  },
};
