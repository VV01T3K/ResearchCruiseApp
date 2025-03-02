import { MockRouterProvider } from '@stories/mocks/MockRouterProvider';
import type { Meta, StoryObj } from '@storybook/react';
import GlobeAmericasIcon from 'bootstrap-icons/icons/globe-americas.svg?react';

import { DashboardGrid } from '@/dashboard/components/DashboardGrid';
import { DashboardGridCard } from '@/dashboard/components/DashboardGridCard';

const meta = {
  component: DashboardGridCard,
  args: {
    name: 'Grid card',
    Icon: GlobeAmericasIcon,
    description: 'Grid card description',
    href: '#',
  },
  decorators: [
    (Story) => (
      <DashboardGrid>
        <Story />
      </DashboardGrid>
    ),
  ],
  render: (args) => (
    <>
      <DashboardGridCard {...args} />
      <DashboardGridCard {...args} className="col-span-2" />
      <DashboardGridCard {...args} className="col-span-2 row-span-2" />
      <DashboardGridCard {...args} className="row-span-2" />
    </>
  ),
} satisfies Meta<typeof DashboardGridCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLink: Story = {
  args: {
    name: 'Grid card with link',
    href: '/link',
  },
  decorators: [
    (Story) => (
      <MockRouterProvider>
        <Story />
      </MockRouterProvider>
    ),
  ],
};

export const WithBackground: Story = {
  args: {
    name: 'Grid card with background',
  },
};
