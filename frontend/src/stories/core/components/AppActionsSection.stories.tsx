import type { Meta, StoryObj } from '@storybook/react';

import { AppActionsSection } from '@/core/components/AppActionsSection';
import { AppButton } from '@/core/components/AppButton';

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
