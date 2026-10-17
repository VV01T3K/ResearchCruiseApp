import type { Meta, StoryObj } from '@storybook/react-vite';
import GlobeAmericasIcon from 'bootstrap-icons/icons/globe-americas.svg?react';

import { Grid } from '@/components/dashboard/Grid';
import { GridCard } from '@/components/dashboard/GridCard';
import AppBackground from '@/components/shared/layout/AppBackground';

const meta = {
  component: GridCard,
  args: {
    name: 'Grid card',
    Icon: GlobeAmericasIcon,
    description: 'Grid card description',
    href: '#',
  },
  decorators: [
    (Story) => (
      <Grid>
        <Story />
      </Grid>
    ),
  ],
  render: (args) => (
    <>
      <GridCard {...args} />
      <GridCard {...args} className="col-span-2" />
      <GridCard {...args} className="col-span-2 row-span-2" />
      <GridCard {...args} className="row-span-2" />
    </>
  ),
} satisfies Meta<typeof GridCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithLink: Story = {
  args: {
    name: 'Grid card with link',
    href: '/link',
  },
};

export const WithBackground: Story = {
  decorators: [
    (Story) => (
      <>
        <AppBackground />
        <Story />
      </>
    ),
  ],
  args: {
    name: 'Grid card with background',
  },
};
