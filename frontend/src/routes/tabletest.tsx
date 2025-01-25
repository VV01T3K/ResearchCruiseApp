import { AppButton } from '@core/components/AppButton';
import { AppPage } from '@core/components/AppPage';
import { Publication } from '@core/models';
import { createFileRoute } from '@tanstack/react-router';
import { createColumnHelper } from '@tanstack/react-table';
import React from 'react';
import { AppTable } from 'src/features/table/components/AppTable';

export const Route = createFileRoute('/tabletest')({
  component: TableTest,
});

const initialData: Publication[] = [
  {
    id: '123',
    category: 'Category 1',
    doi: '21312.1233',
    authors: 'Author 1',
    title: 'Title 1',
    magazine: 'Magazine 1',
    year: '2015',
    ministerialPoints: '120',
  },
  {
    id: '124',
    category: 'Category 2',
    doi: '21312.1234',
    authors: 'Author 2',
    title: 'Title 2',
    magazine: 'Magazine 2',
    year: '2016',
    ministerialPoints: '130',
  },
  {
    id: '125',
    category: 'Category 3',
    doi: '21312.1235',
    authors: 'Author 3',
    title: 'Title 3',
    magazine: 'Magazine 3',
    year: '2017',
    ministerialPoints: '140',
  },
  {
    id: '126',
    category: 'Category 4',
    doi: '21312.1236',
    authors: 'Author 4',
    title: 'Title 4',
    magazine: 'Magazine 4',
    year: '2018',
    ministerialPoints: '150',
  },
];

const columnHelper = createColumnHelper<Publication>();
const defaultColumns = [
  columnHelper.accessor('category', {
    header: 'Category',
    cell: (cell) => cell.getValue(),
  }),
  columnHelper.accessor('doi', {
    header: 'DOI',
    cell: (cell) => cell.getValue(),
  }),
  columnHelper.accessor('authors', {
    header: 'Authors',
    cell: (cell) => cell.getValue(),
  }),
  columnHelper.accessor('title', {
    header: 'Title',
    cell: (cell) => cell.getValue(),
  }),
  columnHelper.accessor('magazine', {
    header: 'Magazine',
    cell: (cell) => cell.getValue(),
  }),
  columnHelper.accessor('year', {
    header: 'Year',
    cell: (cell) => cell.getValue(),
  }),
  columnHelper.accessor('ministerialPoints', {
    header: 'Ministerial Points',
    cell: (cell) => cell.getValue(),
  }),
  columnHelper.display({
    header: 'Actions',
    cell: (cell) => (
      <AppButton onClick={() => alert(cell.row.id)} variant="primaryOutline">
        Click me
      </AppButton>
    ),
  }),
];

function TableTest() {
  const [data] = React.useState(initialData);

  return (
    <AppPage title="Table Test">
      <AppTable data={data} columns={defaultColumns}></AppTable>
    </AppPage>
  );
}
