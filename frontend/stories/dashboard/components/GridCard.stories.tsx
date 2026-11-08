import type { Meta, StoryObj } from '@storybook/react-vite';
import { GlobeHemisphereWestIcon } from '@phosphor-icons/react';

import { Grid } from '@/components/dashboard/Grid';
import { GridCard } from '@/components/dashboard/GridCard';
import Background from '@/components/shared/layout/Background';

const meta = {
  component: GridCard,
  args: {
    name: 'Grid card',
    Icon: GlobeHemisphereWestIcon,
    description: 'Grid card description',
    to: '/',
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
    to: '/help',
  },
};

export const WithBackground: Story = {
  decorators: [
    (Story) => (
      <>
        <Background />
        <Story />
      </>
    ),
  ],
  args: {
    name: 'Grid card with background',
  },
};
