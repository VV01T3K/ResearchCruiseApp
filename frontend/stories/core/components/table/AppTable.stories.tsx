import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';

import { AppButton } from '@/components/shared/AppButton';
import { AppTable } from '@/components/shared/table/AppTable';

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

export const Sorted: Story = {
  args: { initialSortingState: [{ id: 'Name', desc: false }] },
  play: async ({ canvas, canvasElement, userEvent }) => {
    const rows = () => canvas.getAllByRole('row').filter((row) => within(row).queryAllByRole('cell').length > 0);
    await expect(rows()[0]).toHaveTextContent('Jane Doe');
    await userEvent.click(canvas.getByRole('button', { name: 'Age' }));
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(await page.findByRole('menuitem', { name: 'Sortuj malejąco' }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(rows()[0]).toHaveTextContent('John Smith'));
  },
};

export const Disabled: Story = { args: { disabled: true } };
export const EmptyWithErrors: Story = {
  args: {
    variant: 'form',
    data: [],
    emptyTableMessage: 'Add at least one participant',
    errors: ['Participants are required'],
    showRequiredAsterisk: true,
  },
};

export const LoadingMore: Story = {
  args: {
    infiniteScroll: {
      hasNextPage: true,
      isFetchingNextPage: true,
      isFetching: true,
      pageCount: 1,
      fetchNextPage: fn(),
    },
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('status', { name: 'Wczytywanie…' })).toBeVisible();
  },
};
