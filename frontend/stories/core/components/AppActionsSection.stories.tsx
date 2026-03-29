import type { Meta, StoryObj } from '@storybook/react-vite';

import { AppActionsSection } from '@/components/shared/AppActionsSection';
import { AppButton } from '@/components/shared/AppButton';

const meta = {
  component: AppActionsSection,
  args: {
    children: (
      <>
        <AppButton variant="primaryOutline">Form</AppButton>
        <AppButton variant="primary">Actions</AppButton>
      </>
    ),
  },
} satisfies Meta<typeof AppActionsSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
