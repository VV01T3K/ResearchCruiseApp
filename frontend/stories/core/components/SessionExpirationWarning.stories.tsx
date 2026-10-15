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
    },
  },
} satisfies Meta<typeof SessionExpirationWarning>;

export default meta;
type Story = StoryObj<typeof meta>;
export const Expiring: Story = {
  play: async ({ args, canvasElement, userEvent }) => {
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(await page.findByRole('button', { name: 'Odśwież sesję' }));
    await expect(args.onRefreshSession).toHaveBeenCalledTimes(1);
    await userEvent.click(page.getByRole('button', { name: 'Wyloguj' }));
    await expect(args.onSignOut).toHaveBeenCalledTimes(1);
  },
};
export const Active: Story = { args: { expirationDate: new Date('2026-01-15T14:00:00Z') } };
export const Expired: Story = { args: { expirationDate: new Date('2026-01-15T11:59:00Z') } };
