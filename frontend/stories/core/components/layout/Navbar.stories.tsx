import { MockAuthQueryProvider } from '@stories/mocks/MockAuthQueryProvider';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { Navbar } from '@/components/shared/layout/Navbar';

const meta = {
  component: Navbar,
} satisfies Meta<typeof Navbar>;

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

export const LoggedOut: Story = {
  decorators: [
    (Story) => (
      <MockAuthQueryProvider>
        <Story />
      </MockAuthQueryProvider>
    ),
  ],
};
