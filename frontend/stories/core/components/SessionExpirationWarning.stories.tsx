import type { Meta, StoryObj } from '@storybook/react-vite';
import { fn } from 'storybook/test';
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
export const Expiring: Story = {};
export const Active: Story = { args: { expirationDate: new Date('2026-01-15T14:00:00Z') } };
export const Expired: Story = { args: { expirationDate: new Date('2026-01-15T11:59:00Z') } };
