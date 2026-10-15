import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor } from 'storybook/test';
import { SessionStatusBadge } from '@/components/shared/SessionStatusBadge';

const meta = {
  component: SessionStatusBadge,
  args: {
    refreshTokenExpirationDate: new Date('2026-01-15T14:00:00Z'),
    onRefresh: fn().mockResolvedValue(undefined),
  },
  decorators: [
    (Story) => (
      <div className="inline-block bg-primary p-4">
        <Story />
      </div>
    ),
  ],
  parameters: {
    docs: {
      description: {
        component:
          'Shows remaining session time and a manual refresh action. The story clock is fixed so countdown states are repeatable.',
      },
    },
  },
} satisfies Meta<typeof SessionStatusBadge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Active: Story = {};
export const Expiring: Story = { args: { refreshTokenExpirationDate: new Date('2026-01-15T12:04:00Z') } };
export const Expired: Story = { args: { refreshTokenExpirationDate: new Date('2026-01-15T11:59:00Z') } };
export const Refreshing: Story = {
  args: { onRefresh: fn(() => new Promise<void>(() => {})) },
  play: async ({ canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Odśwież sesję' });
    await userEvent.click(button);
    await expect(button).toBeDisabled();
  },
};
export const RefreshCompleted: Story = {
  play: async ({ args, canvas, userEvent }) => {
    const button = canvas.getByRole('button', { name: 'Odśwież sesję' });
    await userEvent.click(button);
    await expect(args.onRefresh).toHaveBeenCalledTimes(1);
    await waitFor(() => expect(button).toBeEnabled());
  },
};
