import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AppFileList } from '@/core/components/inputs/parts/AppFileList';

const meta = {
  component: AppFileList,
  args: {
    files: [
      {
        name: 'File 1',
        content: 'Content 1',
      },
      {
        name: 'File 2',
        content: 'Content 2',
      },
    ],
  },
} satisfies Meta<typeof AppFileList>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Removable: Story = {
  args: {
    onRemove: fn(),
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
