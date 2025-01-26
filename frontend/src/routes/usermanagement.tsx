import { AppPage } from '@core/components';
import { AppBadge } from '@core/components/AppBadge';
import { AppButton } from '@core/components/AppButton';
import { AppInitialsAvatar } from '@core/components/AppInitialsAvatar';
import { AppLoader } from '@core/components/AppLoader';
import { AppModal } from '@core/components/AppModal';
import { UserContext } from '@core/contexts/UserContext';
import { allowOnly, client } from '@core/helpers';
import { Role, User } from '@core/models';
import { cn } from '@lib/utils';
import { useSuspenseQuery } from '@tanstack/react-query';
import { createFileRoute } from '@tanstack/react-router';
import { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import { AppTable } from 'src/features/table/components/AppTable';
import { EditUserForm } from 'src/features/usermanagement/components/EditUserForm';
import { GroupActionSection } from 'src/features/usermanagement/components/GroupActionSection';
import { RoleBadge } from 'src/features/usermanagement/components/RoleBadge';
import { getAllowedRoles, getRoleName } from 'src/features/usermanagement/helpers';

export const Route = createFileRoute('/usermanagement')({
  component: RouteComponent,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner),
});

type ModalStates =
  | { state: 'none' }
  | { state: 'newUserModal' }
  | { state: 'groupActionsModal' }
  | { state: 'editUserModal'; user: User };

function RouteComponent() {
  const userContext = React.useContext(UserContext);

  const [selectedUsers, setSelectedUsers] = React.useState<string[]>([]);
  const [modalState, setModalState] = React.useState<ModalStates>({ state: 'none' });

  const usersQuery = useSuspenseQuery({
    queryKey: ['users'],
    queryFn: () => {
      return client.get('/users');
    },
    select: (data) => data.data as User[],
  });

  function toggleUserSelection(userId: string) {
    setSelectedUsers((selectedUser) => {
      if (selectedUser.includes(userId)) {
        return selectedUser.filter((id) => id !== userId);
      }

      return [...selectedUser, userId];
    });
  }

  function isUserSelected(userId: string) {
    return selectedUsers.includes(userId);
  }

  function toggleSelectAllUsers() {
    if (areAllUsersSelected()) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(usersQuery.data?.map((user) => user.id) ?? []);
    }
  }

  function areAllUsersSelected() {
    return usersQuery.data?.length === selectedUsers.length;
  }

  async function handleModalClose() {
    setModalState({ state: 'none' });
    await usersQuery.refetch();
  }

  const columns: ColumnDef<User>[] = [
    {
      id: 'selector',
      header: () => (
        <input
          type="checkbox"
          onChange={() => toggleSelectAllUsers()}
          checked={areAllUsersSelected()}
          className="mx-4"
        />
      ),
      cell: (cell) => (
        <input
          type="checkbox"
          onChange={() => toggleUserSelection(cell.row.original.id)}
          checked={isUserSelected(cell.row.original.id)}
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
    },
    {
      id: 'avatar',
      header: undefined,
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      cell: (cell) => <AppInitialsAvatar fullName={cell.getValue() as string} variant="small" />,
      enableColumnFilter: false,
      enableSorting: false,
    },
    {
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: 'Imię i nazwisko',
    },
    {
      accessorFn: (row) => row.email,
      header: 'Email',
    },
    {
      id: 'accountStatus',
      accessorFn: (row) => (row.accepted ? 'Zaakceptowane' : 'Niezaakceptowane'),
      header: 'Stan Konta',
      cell: (cell) => {
        const value = cell.getValue() as 'Zaakceptowane' | 'Niezaakceptowane';
        return <AppBadge variant={value === 'Zaakceptowane' ? 'success' : 'danger'}>{value}</AppBadge>;
      },
    },
    {
      id: 'emailStatus',
      accessorFn: (row) => (row.emailConfirmed ? 'Zweryfikowany' : 'Niezweryfikowany'),
      header: 'Stan Emaila',
      cell: (cell) => {
        const value = cell.getValue() as 'Zweryfikowany' | 'Niezweryfikowany';
        return <AppBadge variant={value === 'Zweryfikowany' ? 'success' : 'danger'}>{value}</AppBadge>;
      },
    },
    {
      id: 'role',
      accessorFn: (row) => getRoleName(row.roles[0]),
      header: 'Rola',
      cell: ({ row }) => <RoleBadge role={row.original.roles[0]} />,
    },
    {
      id: 'actions',
      header: undefined,
      cell: (cell) => (
        <div className="flex items-center justify-around">
          <AppButton
            variant="primary"
            onClick={() => setModalState({ state: 'editUserModal', user: cell.row.original })}
          >
            Edytuj
          </AppButton>
        </div>
      ),
    },
  ];

  return (
    <>
      <AppPage title="Zarządzanie użytkownikami">
        <React.Suspense fallback={<AppLoader />}>
          <AppTable
            data={usersQuery.data}
            columns={columns}
            extraButtonsUpdater={(predefinedButtons) => [
              <AppButton variant="primary" onClick={() => setModalState({ state: 'newUserModal' })}>
                Dodaj użytkownika
              </AppButton>,
              <AppButton
                variant="warning"
                disabled={selectedUsers.length === 0}
                className={cn(selectedUsers.length === 0 && 'opacity-50')}
                onClick={() => setModalState({ state: 'groupActionsModal' })}
              >
                Akcje Grupowe
              </AppButton>,
              ...predefinedButtons,
            ]}
          />
        </React.Suspense>
      </AppPage>

      <AppModal
        isOpen={modalState.state === 'newUserModal'}
        onClose={() => handleModalClose()}
        title="Dodaj użytkownika"
      >
        <EditUserForm
          users={usersQuery.data}
          allowedRoles={getAllowedRoles(userContext?.currentUser?.roles[0])}
          close={() => handleModalClose()}
          canRemoveUsers={false}
        />
      </AppModal>
      <AppModal
        isOpen={modalState.state === 'groupActionsModal' && selectedUsers.length > 0}
        onClose={() => handleModalClose()}
        title="Akcje grupowe"
      >
        <GroupActionSection
          selectedUsers={usersQuery.data.filter((user) => selectedUsers.some((userId) => user.id === userId))}
          canRemoveUsers={userContext?.currentUser?.roles[0] === Role.Administrator}
          close={() => handleModalClose()}
        />
      </AppModal>
      <AppModal
        isOpen={modalState.state === 'editUserModal' && 'user' in modalState}
        onClose={() => handleModalClose()}
        title="Edytuj użytkownika"
      >
        <EditUserForm
          user={(modalState as { state: 'editUserModal'; user: User }).user}
          users={usersQuery.data}
          allowedRoles={getAllowedRoles(userContext?.currentUser?.roles[0])}
          close={() => handleModalClose()}
          canRemoveUsers={userContext?.currentUser?.roles[0] === Role.Administrator}
        />
      </AppModal>
    </>
  );
}
