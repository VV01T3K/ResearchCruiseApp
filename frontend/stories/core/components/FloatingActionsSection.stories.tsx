import type { Meta, StoryObj } from '@storybook/react-vite';

import { FloatingActionsSection } from '@/components/shared/FloatingActionsSection';
import { Button } from '@/components/shared/Button';

const meta = {
  component: FloatingActionsSection,
  args: {
    children: (
      <>
        <Button variant="primaryOutline">Form</Button>
        <Button variant="primary">Actions</Button>
      </>
    ),
  },
} satisfies Meta<typeof FloatingActionsSection>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
