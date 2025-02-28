import type { Meta, StoryObj } from '@storybook/react';
import GlobeAmericasIcon from 'bootstrap-icons/icons/globe-americas.svg?react';

import { CompanyInfoCard } from '@/other/components/CompanyInfoCard';

const meta = {
  component: CompanyInfoCard,
} satisfies Meta<typeof CompanyInfoCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    title: 'Company info card',
    icon: <GlobeAmericasIcon />,
  },
};
