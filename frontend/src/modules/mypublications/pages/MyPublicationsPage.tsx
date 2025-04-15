import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import ExternalLinkIcon from 'bootstrap-icons/icons/box-arrow-up-right.svg?react';
import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';
import React from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppLayout } from '@/core/components/AppLayout';
import { AppModal } from '@/core/components/AppModal';
import { AppCheckbox } from '@/core/components/inputs/AppCheckbox';
import { AppTable } from '@/core/components/table/AppTable';
import { UploadPublicationsButton } from '@/mypublications/components/UploadPublicationsButton';
import {
  useDeleteAllOwnPublicationsMutation,
  useDeleteOwnPublicationMutation,
  useOwnPublicationQuery,
  useUploadPublicationsMutation,
} from '@/mypublications/hooks/MyPublicationsApiHooks';
import { Publication } from '@/mypublications/models/Publication';

export function MyPublicationsPage() {
  const [selectedPublications, setSelectedPublications] = React.useState<RowSelectionState>({});
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = React.useState(false);

  const ownPublicationsQuery = useOwnPublicationQuery();
  const deleteOwnPublicationMutation = useDeleteOwnPublicationMutation();
  const deleteAllOwnPublicationsMutation = useDeleteAllOwnPublicationsMutation();
  const uploadPublicationsMutation = useUploadPublicationsMutation();

  function deleteSelectedPublications() {
    Object.keys(selectedPublications).forEach((id) => deleteOwnPublicationMutation.mutateAsync(id));
    setSelectedPublications({});
  }

  const columns: ColumnDef<Publication>[] = [
    {
      id: 'selector',
      header: ({ table }) => (
        <AppCheckbox
          name="selectAllPublications"
          onChange={(x) => table.toggleAllRowsSelected(x)}
          checked={table.getIsAllRowsSelected()}
          size="lg"
        />
      ),
      cell: ({ row }) => (
        <AppCheckbox
          name={`selectPublication-${row.id}`}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={row.getToggleSelectedHandler()}
          className="inline-block"
          size="md"
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 5,
    },
    {
      accessorFn: (row) => row.title,
      header: 'Tytuł',
      cell: (cell) => <p className="font-bold pr-4">{cell.getValue() as string}</p>,
      size: 25,
    },
    {
      accessorFn: (row) => row.authors,
      header: 'Autorzy',
      size: 15,
    },
    {
      accessorFn: (row) => row.doi,
      header: 'DOI',
      size: 15,
    },
    {
      accessorFn: (row) => row.magazine,
      header: 'Czasopismo',
      size: 15,
    },
    {
      accessorFn: (row) => row.year,
      header: 'Rok',
      size: 10,
    },
    {
      accessorFn: (row) => row.ministerialPoints,
      header: 'Punkty ministerialne',
      size: 10,
    },
    {
      id: 'actions',
      header: undefined,
      cell: (cell) => (
        <AppButton
          variant="dangerOutline"
          size="xs"
          onClick={() => deleteOwnPublicationMutation.mutateAsync(cell.row.original.id).catch(() => {})}
        >
          <TrashIcon className="h-3 w-3 mr-2" />
          Usuń
        </AppButton>
      ),
      size: 5,
    },
  ];

  return (
    <>
      <AppLayout title="Moje publikacje">
        <AppTable
          data={ownPublicationsQuery.data}
          columns={columns}
          rowSelectionState={selectedPublications}
          setRowSelectionState={setSelectedPublications}
          getRowId={(row) => row.id}
          emptyTableMessage="Nie dodano żadnej publikacji"
          buttons={(defaultButtons) => [
            <UploadPublicationsButton key="upload" onUpload={uploadPublicationsMutation.mutate} />,
            <AppButton
              key="goToRepository"
              type="link"
              variant="primaryOutline"
              href="https://repozytorium.bg.ug.edu.pl/search.seam"
              target="_blank"
            >
              Przejdź do repozytorium BG
              <ExternalLinkIcon className="h-4 w-4 ml-2" />
            </AppButton>,
            <AppButton
              key="removeAllPublications"
              variant="dangerOutline"
              onClick={() => setIsDeleteAllModalOpen(true)}
              disabled={!ownPublicationsQuery.data?.length || deleteAllOwnPublicationsMutation.isPending}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Usuń wszystkie publikacje
            </AppButton>,
            <AppButton
              key="removeSelectedPublications"
              variant="dangerOutline"
              onClick={() => deleteSelectedPublications()}
              disabled={!Object.keys(selectedPublications).length || deleteOwnPublicationMutation.isPending}
            >
              <TrashIcon className="h-4 w-4 mr-2" />
              Usuń zaznaczone publikacje
            </AppButton>,
            ...defaultButtons,
          ]}
        ></AppTable>
      </AppLayout>
      <AppModal
        isOpen={isDeleteAllModalOpen}
        onClose={() => setIsDeleteAllModalOpen(false)}
        title="Czy na pewno chcesz usunąć wszystkie publikacje?"
      >
        Usunięcie publikacji jest nieodwracalne.
        <div className="flex flex-row gap-4 mt-4">
          <AppButton
            variant="dangerOutline"
            className="basis-2/3"
            onClick={async () => {
              await deleteAllOwnPublicationsMutation.mutateAsync();
              setIsDeleteAllModalOpen(false);
            }}
            disabled={deleteAllOwnPublicationsMutation.isPending}
          >
            Usuń wszystkie publikacje
          </AppButton>
          <AppButton
            variant="primaryOutline"
            className="basis-1/3"
            onClick={() => {
              setIsDeleteAllModalOpen(false);
            }}
            disabled={deleteAllOwnPublicationsMutation.isPending}
          >
            Anuluj
          </AppButton>
        </div>
      </AppModal>
    </>
  );
}
