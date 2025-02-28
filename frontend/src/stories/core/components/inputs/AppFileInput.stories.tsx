import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { AppFileInput } from '@/core/components/inputs/AppFileInput';

const meta = {
  component: AppFileInput,
  args: {
    name: 'name',
    value: {
      name: 'File 1',
      content: 'Content 1',
    },
    allowMultiple: false,
    onChange: fn(),
    onBlur: fn(),
  },
} satisfies Meta<typeof AppFileInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const Required: Story = {
  args: {
    required: true,
  },
};

export const Multiple: Story = {
  args: {
    allowMultiple: true,
    value: [
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
};

export const WithLabel: Story = {
  args: {
    label: 'File input',
  },
};

export const WithErrors: Story = {
  args: {
    errors: ['Error message'],
  },
};

export const WithHelper: Story = {
  args: {
    helper: 'Helper message',
  },
};

export const WithUploadMessage: Story = {
  args: {
    uploadMessage: 'Upload message',
  },
};

export const WithMaxSize: Story = {
  args: {
    maxSizeInMb: 10,
    allowMultiple: true,
    value: [],
  },
};

export const WithAcceptedMimeTypes: Story = {
  args: {
    acceptedMimeTypes: ['application/pdf'],
    allowMultiple: true,
    value: [],
  },
};
