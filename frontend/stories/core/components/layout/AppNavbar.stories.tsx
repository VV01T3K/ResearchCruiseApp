import { MockAuthQueryProvider } from '@stories/mocks/MockAuthQueryProvider';
import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, mocked, waitFor } from 'storybook/test';

import { customFetch } from '@/api/fetch';
import { AppNavbar } from '@/components/shared/layout/AppNavbar';

const meta = {
  component: AppNavbar,
  beforeEach: () => {
    mocked(customFetch).mockResolvedValue(undefined);
  },
} satisfies Meta<typeof AppNavbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  decorators: [
    (Story) => (
      <MockAuthQueryProvider loggedIn>
        <Story />
      </MockAuthQueryProvider>
    ),
  ],
};

export const SignOut: Story = {
  ...LoggedIn,
  play: async ({ canvas, userEvent }) => {
    await userEvent.click(canvas.getByTestId('sign-out-btn'));
    await waitFor(() =>
      expect(mocked(customFetch)).toHaveBeenCalledWith('/v2/auth/logout', expect.objectContaining({ method: 'POST' }))
    );
    await waitFor(() => expect(canvas.queryByTestId('sign-out-btn')).not.toBeInTheDocument());
  },
};

export const LoggedOut: Story = {
  decorators: [
    (Story) => (
      <MockAuthQueryProvider>
        <Story />
      </MockAuthQueryProvider>
    ),
  ],
};
