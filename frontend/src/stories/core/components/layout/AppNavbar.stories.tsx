import { MockRouterProvider } from '@stories/mocks/MockRouterProvider';
import { MockUserContextProvider } from '@stories/mocks/MockUserContextProvider';
import type { Meta, StoryObj } from '@storybook/react';

import { AppNavbar } from '@/core/components/layout/AppNavbar';

const meta = {
  component: AppNavbar,
} satisfies Meta<typeof AppNavbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const LoggedIn: Story = {
  decorators: [
    (Story) => (
      <MockUserContextProvider loggedIn>
        <Story />
      </MockUserContextProvider>
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
      <MockUserContextProvider>
        <Story />
      </MockUserContextProvider>
    ),
    (Story) => (
      <MockRouterProvider>
        <Story />
      </MockRouterProvider>
    ),
  ],
};
