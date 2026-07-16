import { MockRouterProvider } from '@stories/mocks/MockRouterProvider';
import { MockAuthQueryProvider } from '@stories/mocks/MockAuthQueryProvider';
import type { Meta, StoryObj } from '@storybook/react-vite';

import { AppNavbar } from '@/components/shared/layout/AppNavbar';

const meta = {
  component: AppNavbar,
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
    (Story) => (
      <MockRouterProvider>
        <Story />
      </MockRouterProvider>
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
    (Story) => (
      <MockRouterProvider>
        <Story />
      </MockRouterProvider>
    ),
  ],
};
