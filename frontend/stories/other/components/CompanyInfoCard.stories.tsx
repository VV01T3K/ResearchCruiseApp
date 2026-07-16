import type { Meta, StoryObj } from '@storybook/react-vite';
import { Globe2 as GlobeAmericasIcon } from 'lucide-react';

import { CompanyInfoCard } from '@/components/shared/CompanyInfoCard';

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
