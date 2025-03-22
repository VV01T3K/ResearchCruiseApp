import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { CruiseApplicationPeriodInput } from '@/cruise-applications/components/common/CruiseApplicationPeriodInput';

const meta = {
  component: CruiseApplicationPeriodInput,
  args: {
    name: 'Period input',
    value: ['5', '12'],
    maxValues: undefined,
    onChange: fn(),
    onBlur: fn(),
    errors: undefined,
    label: undefined,
    helper: undefined,
  },
} satisfies Meta<typeof CruiseApplicationPeriodInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithMaxValues: Story = {
  args: {
    maxValues: ['6', '18'],
  },
};

export const WithLabel: Story = {
  args: {
    label: 'Period input',
  },
};

export const WithErrors: Story = {
  args: {
    errors: ['Something went wrong'],
  },
};

export const WithHelper: Story = {
  args: {
    helper: 'Some helper text',
  },
};
