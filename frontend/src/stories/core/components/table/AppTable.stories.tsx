import type { Meta, StoryObj } from '@storybook/react';

import { AppButton } from '@/core/components/AppButton';
import { AppTable } from '@/core/components/table/AppTable';

type ExampleUser = {
  id: number;
  name: string;
  age: number;
  email: string;
};

const meta: Meta<typeof AppTable<ExampleUser>> = {
  component: AppTable,
  args: {
    data: [
      {
        id: 1,
        name: 'John Doe',
        age: 32,
        email: 'john@doe.com',
      },
      {
        id: 2,
        name: 'Jane Doe',
        age: 30,
        email: 'jane@doe.com',
      },
      {
        id: 3,
        name: 'John Smith',
        age: 40,
        email: 'john@smith.com',
      },
    ],
    columns: [
      {
        accessorFn: (row) => row.id,
        header: 'ID',
        enableSorting: false,
        enableColumnFilter: false,
      },
      {
        accessorFn: (row) => row.name,
        header: 'Name',
      },
      {
        accessorFn: (row) => row.age,
        header: 'Age',
      },
      {
        accessorFn: (row) => row.email,
        header: 'Email',
      },
    ],
  },
} satisfies Meta<typeof AppTable<ExampleUser>>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const WithEmptyData: Story = {
  args: {
    data: [],
    emptyTableMessage: 'No data',
  },
};

export const WithButtons: Story = {
  args: {
    buttons: (predefinedButtons) => [
      ...predefinedButtons,
      <AppButton key="button-1">Button 1</AppButton>,
      <AppButton key="button-2">Button 2</AppButton>,
    ],
  },
};

export const FormVariant: Story = {
  args: {
    variant: 'form',
  },
};
