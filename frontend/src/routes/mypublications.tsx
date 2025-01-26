import { AppButton } from '@core/components/AppButton';
import { AppModal } from '@core/components/AppModal';
import { Publication, Role } from '@core/models';
import { createFileRoute } from '@tanstack/react-router';
import { Suspense, useState } from 'react';
import { allowOnly } from '@core/helpers';
import { AppLoader, AppPage } from '@core/components';
import { ColumnDef } from '@tanstack/react-table';
import { AppTable } from 'src/features/table/components/AppTable';
import ExternalLinkIcon from 'bootstrap-icons/icons/box-arrow-up-right.svg?react';
import TrashIcon from 'bootstrap-icons/icons/trash.svg?react';
import {
  useDeleteAllOwnPublicationsMutation,
  useDeleteOwnPublicationMutation,
  useOwnPublicationQuery,
  useUploadPublicationsMutation,
} from 'src/features/mypublications/hooks/MyPublicationsHooks';
import { UploadFileButton } from 'src/features/mypublications/components/UploadFileButton';

export const Route = createFileRoute('/mypublications')({
  component: MyPublications,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.CruiseManager, Role.ShipOwner),
});

function MyPublications() {
  const [selectedPublications, setSelectedPublications] = useState<string[]>([]);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

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
          leftIcon={TrashIcon}
          size="xs"
          onClick={() => {
            deleteOwnPublicationMutation.mutate(cell.row.original.id);
          }}
        >
          Usuń
        </AppButton>
      ),
    },
  ];

  return (
    <>
      <AppPage title="Moje publikacje" variant="defaultWithoutCentering">
        <Suspense fallback={<AppLoader />}>
          <AppTable
            data={ownPublicationsQuery.data}
            columns={columns}
            extraButtonsUpdater={(predefinedButtons) => [
              <UploadFileButton onUpload={(publications) => uploadPublicationsMutation.mutate(publications)} />,
              <AppButton
                rightIcon={ExternalLinkIcon}
                variant="primaryOutline"
                link
                to="https://repozytorium.bg.ug.edu.pl/search.seam"
              >
                Przejdź do repozytorium BG
              </AppButton>,
              <AppButton leftIcon={TrashIcon} variant="dangerOutline" onClick={() => setIsDeleteAllModalOpen(true)}>
                Usuń wszystkie publikacje
              </AppButton>,
              ...predefinedButtons,
            ]}
          />
        </Suspense>
      </AppPage>

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
            onClick={() => {
              deleteAllOwnPublicationsMutation.mutate();
              setIsDeleteAllModalOpen(false);
            }}
          >
            Usuń wszystkie publikacje
          </AppButton>
          <AppButton
            variant="primaryOutline"
            className="basis-1/3"
            onClick={() => {
              setIsDeleteAllModalOpen(false);
            }}
          >
            Anuluj
          </AppButton>
        </div>
      </AppModal>
    </>
  );
}
