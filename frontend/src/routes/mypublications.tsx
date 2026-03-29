import { createFileRoute } from '@tanstack/react-router';

import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import ExternalLinkIcon from 'bootstrap-icons/icons/box-arrow-up-right.svg?react';
import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';
import React from 'react';

import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppModal } from '@/components/shared/AppModal';
import { AppCheckbox } from '@/components/shared/inputs/AppCheckbox';
import { AppTable } from '@/components/shared/table/AppTable';
import { UploadPublicationsButton } from '@/components/publications/UploadPublicationsButton';
import {
  useDeleteAllOwnPublicationsMutation,
  useDeleteOwnPublicationMutation,
  useOwnPublicationQuery,
  useUploadPublicationsMutation,
} from '@/api/hooks/publications/MyPublicationsApiHooks';
import { Publication } from '@/api/dto/publications/Publication';
import { allowOnly } from '@/lib/guards';
import { Role } from '@/models/shared/Role';

export const Route = createFileRoute('/mypublications')({
  component: MyPublicationsPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.CruiseManager, Role.ShipOwner),
});

function MyPublicationsPage() {
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
      cell: (cell) => <p className="pr-4 font-bold">{cell.getValue() as string}</p>,
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
          <TrashIcon className="mr-2 h-3 w-3" />
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
              <ExternalLinkIcon className="ml-2 h-4 w-4" />
            </AppButton>,
            <AppButton
              key="removeAllPublications"
              variant="dangerOutline"
              onClick={() => setIsDeleteAllModalOpen(true)}
              disabled={!ownPublicationsQuery.data?.length || deleteAllOwnPublicationsMutation.isPending}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
              Usuń wszystkie publikacje
            </AppButton>,
            <AppButton
              key="removeSelectedPublications"
              variant="dangerOutline"
              onClick={() => deleteSelectedPublications()}
              disabled={!Object.keys(selectedPublications).length || deleteOwnPublicationMutation.isPending}
            >
              <TrashIcon className="mr-2 h-4 w-4" />
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
        <div className="mt-4 flex flex-row gap-4">
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
