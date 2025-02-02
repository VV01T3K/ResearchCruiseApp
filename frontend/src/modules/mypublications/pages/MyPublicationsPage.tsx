import { ColumnDef } from '@tanstack/react-table';
import ExternalLinkIcon from 'bootstrap-icons/icons/box-arrow-up-right.svg?react';
import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';
import React, { Suspense } from 'react';

import { AppButton } from '@/core/components/AppButton';
import { AppLayout } from '@/core/components/AppLayout';
import { AppLoader } from '@/core/components/AppLoader';
import { AppModal } from '@/core/components/AppModal';
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
  const [selectedPublications, setSelectedPublications] = React.useState<string[]>([]);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = React.useState(false);

  const ownPublicationsQuery = useOwnPublicationQuery();
  const deleteOwnPublicationMutation = useDeleteOwnPublicationMutation();
  const deleteAllOwnPublicationsMutation = useDeleteAllOwnPublicationsMutation();
  const uploadPublicationsMutation = useUploadPublicationsMutation();

  function togglePublicationSelection(publicationId: string) {
    setSelectedPublications((selectedPublications) => {
      if (selectedPublications.includes(publicationId)) {
        return selectedPublications.filter((id) => id !== publicationId);
      }

      return [...selectedPublications, publicationId];
    });
  }

  function isPublicationSelected(publicationId: string) {
    return selectedPublications.includes(publicationId);
  }

  function toggleSelectAllPublications() {
    setSelectedPublications((selectedPublications) => {
      if (selectedPublications.length === ownPublicationsQuery.data?.length) {
        return [];
      }

      return ownPublicationsQuery.data?.map((publication) => publication.id) ?? [];
    });
  }

  function areAllPublicationsSelected() {
    return selectedPublications.length === ownPublicationsQuery.data?.length;
  }

  const columns: ColumnDef<Publication>[] = [
    {
      id: 'selector',
      header: () => (
        <input
          type="checkbox"
          onChange={() => toggleSelectAllPublications()}
          checked={areAllPublicationsSelected()}
          className="mx-4"
        />
      ),
      cell: (cell) => (
        <input
          type="checkbox"
          onChange={() => togglePublicationSelection(cell.row.original.id)}
          checked={isPublicationSelected(cell.row.original.id)}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      accessorFn: (row) => row.title,
      header: 'Tytuł',
      cell: (cell) => <p className="font-bold pr-4">{cell.getValue() as string}</p>,
    },
    {
      accessorFn: (row) => row.authors,
      header: 'Autorzy',
    },
    {
      accessorFn: (row) => row.doi,
      header: 'DOI',
    },
    {
      accessorFn: (row) => row.magazine,
      header: 'Czasopismo',
    },
    {
      accessorFn: (row) => row.year,
      header: 'Rok',
    },
    {
      accessorFn: (row) => row.ministerialPoints,
      header: 'Punkty ministerialne',
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
    },
  ];

  return (
    <>
      <AppLayout title="Moje publikacje" variant="defaultWithoutCentering">
        <Suspense fallback={<AppLoader />}>
          <AppTable
            data={ownPublicationsQuery.data}
            columns={columns}
            buttons={(defaultButtons) => [
              <UploadPublicationsButton key="upload" onUpload={uploadPublicationsMutation.mutate} />,
              <AppButton
                key="goToRepository"
                type="link"
                variant="primaryOutline"
                href="https://repozytorium.bg.ug.edu.pl/search.seam"
              >
                Przejdź do repozytorium BG
                <ExternalLinkIcon className="h-4 w-4 ml-2" />
              </AppButton>,
              <AppButton
                key="removeAllPublications"
                variant="dangerOutline"
                onClick={() => setIsDeleteAllModalOpen(true)}
              >
                <TrashIcon className="h-4 w-4 mr-2" />
                Usuń wszystkie publikacje
              </AppButton>,
              ...defaultButtons,
            ]}
          ></AppTable>
        </Suspense>
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
