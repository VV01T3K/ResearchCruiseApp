import type { Meta, StoryObj } from '@storybook/react-vite';

import { AppLoader } from '@/components/layout/AppLoader';

const meta = {
  component: AppLoader,
} satisfies Meta<typeof AppLoader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
