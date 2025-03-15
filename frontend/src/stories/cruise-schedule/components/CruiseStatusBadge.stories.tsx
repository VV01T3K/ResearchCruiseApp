import type { Meta, StoryObj } from '@storybook/react';

import { CruiseStatusBadge } from '../../../modules/cruise-schedule/components/CruiseStatusBadge';

const meta = {
  component: CruiseStatusBadge,
} satisfies Meta<typeof CruiseStatusBadge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Nowy: Story = {
  args: {
    status: 'Nowy',
  },
};

export const Potwierdzony: Story = {
  args: {
    status: 'Potwierdzony',
  },
};

export const Zakonczony: Story = {
  args: {
    status: 'Zakończony',
  },
};
