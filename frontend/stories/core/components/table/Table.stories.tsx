import type { Meta, StoryObj } from '@storybook/react-vite';
import { expect, fn, waitFor, within } from 'storybook/test';

import { Button } from '@/components/shared/Button';
import { Table } from '@/components/shared/table/Table';

type ExampleUser = {
  id: number;
  name: string;
  age: number;
  email: string;
};

const meta: Meta<typeof Table<ExampleUser>> = {
  component: Table,
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
} satisfies Meta<typeof Table<ExampleUser>>;

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
      <Button key="button-1">Button 1</Button>,
      <Button key="button-2">Button 2</Button>,
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
    await userEvent.click(canvas.getByRole('button', { name: 'Sortuj i filtruj: Age' }));
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(await page.findByRole('button', { name: 'Sortuj malejąco' }));
    await waitFor(() => expect(rows()[0]).toHaveTextContent('John Smith'));
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
  },
};

export const Filtered: Story = {
  play: async ({ canvas, canvasElement, userEvent }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Sortuj i filtruj: Name' }));
    const page = within(canvasElement.ownerDocument.body);
    await userEvent.click(await page.findByRole('option', { name: 'Jane Doe' }));
    await userEvent.keyboard('{Escape}');
    await waitFor(() => expect(page.queryByRole('dialog')).not.toBeInTheDocument());
    await expect(canvas.getByRole('list', { name: 'Aktywne filtry' })).toHaveTextContent('Jane Doe');
  },
};

export const HeaderStates: Story = {
  args: {
    columns: [
      { accessorFn: (row) => row.id, header: 'ID', enableSorting: false, enableColumnFilter: false },
      { accessorFn: (row) => row.email, header: 'Bez zmian' },
      { accessorFn: (row) => row.name, header: 'Rosnąco' },
      { accessorFn: (row) => row.email, header: 'Malejąco' },
      { accessorFn: (row) => row.name, header: 'Filtr' },
      { accessorFn: (row) => row.age, header: 'Filtr i sortowanie' },
    ],
    initialSortingState: [
      { id: 'Rosnąco', desc: false },
      { id: 'Malejąco', desc: true },
      { id: 'Filtr i sortowanie', desc: false },
    ],
    columnFiltersState: [
      { id: 'Filtr', value: ['Jane Doe'] },
      { id: 'Filtr i sortowanie', value: [30, 32] },
    ],
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
