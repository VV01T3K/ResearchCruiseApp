import { AppButton } from '@core/components/AppButton';
import { AppPage } from '@core/components/AppPage';
import { Publication } from '@core/models';
import { createFileRoute } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { AppTable } from 'src/features/table/components/AppTable';

export const Route = createFileRoute('/(test)/tabletest')({
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
  {
    id: '127',
    category: 'Category 5',
    doi: '21312.1237',
    authors: 'Author 5',
    title: 'Title 5',
    magazine: 'Magazine 5',
    year: '2019',
    ministerialPoints: '160',
  },
  {
    id: '128',
    category: 'Category 6',
    doi: '21312.1238',
    authors: 'Author 6',
    title: 'Title 6',
    magazine: 'Magazine 6',
    year: '2020',
    ministerialPoints: '170',
  },
  {
    id: '129',
    category: 'Category 7',
    doi: '21312.1239',
    authors: 'Author 7',
    title: 'Title 7',
    magazine: 'Magazine 7',
    year: '2021',
    ministerialPoints: '180',
  },
  {
    id: '130',
    category: 'Category 8',
    doi: '21312.1240',
    authors: 'Author 8',
    title: 'Title 8',
    magazine: 'Magazine 8',
    year: '2022',
    ministerialPoints: '190',
  },
  {
    id: '131',
    category: 'Category 9',
    doi: '21312.1241',
    authors: 'Author 9',
    title: 'Title 9',
    magazine: 'Magazine 9',
    year: '2023',
    ministerialPoints: '200',
  },
  {
    id: '132',
    category: 'Category 10',
    doi: '21312.1242',
    authors: 'Author 10',
    title: 'Title 10',
    magazine: 'Magazine 10',
    year: '2024',
    ministerialPoints: '210',
  },
  {
    id: '133',
    category: 'Category 11',
    doi: '21312.1243',
    authors: 'Author 11',
    title: 'Title 11',
    magazine: 'Magazine 11',
    year: '2025',
    ministerialPoints: '220',
  },
  {
    id: '134',
    category: 'Category 12',
    doi: '21312.1244',
    authors: 'Author 12',
    title: 'Title 12',
    magazine: 'Magazine 12',
    year: '2026',
    ministerialPoints: '230',
  },
  {
    id: '135',
    category: 'Category 13',
    doi: '21312.1245',
    authors: 'Author 13',
    title: 'Title 13',
    magazine: 'Magazine 13',
    year: '2027',
    ministerialPoints: '240',
  },
  {
    id: '136',
    category: 'Category 14',
    doi: '21312.1246',
    authors: 'Author 14',
    title: 'Title 14',
    magazine: 'Magazine 14',
    year: '2028',
    ministerialPoints: '250',
  },
  {
    id: '137',
    category: 'Category 15',
    doi: '21312.1247',
    authors: 'Author 15',
    title: 'Title 15',
    magazine: 'Magazine 15',
    year: '2029',
    ministerialPoints: '260',
  },
  {
    id: '138',
    category: 'Category 16',
    doi: '21312.1248',
    authors: 'Author 16',
    title: 'Title 16',
    magazine: 'Magazine 16',
    year: '2030',
    ministerialPoints: '270',
  },
  {
    id: '139',
    category: 'Category 17',
    doi: '21312.1249',
    authors: 'Author 17',
    title: 'Title 17',
    magazine: 'Magazine 17',
    year: '2031',
    ministerialPoints: '280',
  },
  {
    id: '140',
    category: 'Category 18',
    doi: '21312.1250',
    authors: 'Author 18',
    title: 'Title 18',
    magazine: 'Magazine 18',
    year: '2032',
    ministerialPoints: '290',
  },
  {
    id: '141',
    category: 'Category 19',
    doi: '21312.1251',
    authors: 'Author 19',
    title: 'Title 19',
    magazine: 'Magazine 19',
    year: '2033',
    ministerialPoints: '300',
  },
  {
    id: '142',
    category: 'Category 20',
    doi: '21312.1252',
    authors: 'Author 20',
    title: 'Title 20',
    magazine: 'Magazine 20',
    year: '2034',
    ministerialPoints: '310',
  },
];

const defaultColumns: ColumnDef<Publication>[] = [
  {
    accessorFn: (row) => row.category,
    header: 'Category',
    cell: (cell) => cell.getValue(),
  },
  {
    accessorFn: (row) => row.doi,
    header: 'DOI',
    cell: (cell) => cell.getValue(),
  },
  {
    accessorFn: (row) => row.authors,
    header: 'Authors',
    cell: (cell) => cell.getValue(),
  },
  {
    accessorFn: (row) => row.title,
    header: 'Title',
    cell: (cell) => cell.getValue(),
  },
  {
    accessorFn: (row) => row.magazine,
    header: 'Magazine',
    cell: (cell) => cell.getValue(),
  },
  {
    accessorFn: (row) => row.year,
    header: 'Year',
    cell: (cell) => cell.getValue(),
  },
  {
    accessorFn: (row) => row.ministerialPoints,
    header: 'Ministerial Points',
    cell: (cell) => cell.getValue(),
  },
  {
    header: 'Actions',
    cell: (cell) => (
      <AppButton onClick={() => alert(cell.row.id)} variant="primaryOutline">
        Click me
      </AppButton>
    ),
  },
];

function TableTest() {
  const [data] = React.useState(initialData);

  return (
    <AppPage title="Table Test">
      <AppTable data={data} columns={defaultColumns}></AppTable>
    </AppPage>
  );
}
