import { createFileRoute } from '@tanstack/react-router';

import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import React from 'react';

import { AppAvatar } from '@/components/shared/AppAvatar';
import { AppBadge } from '@/components/shared/AppBadge';
import { AppButton } from '@/components/shared/AppButton';
import { AppLayout } from '@/components/shared/AppLayout';
import { AppModal } from '@/components/shared/AppModal';
import { AppCheckbox } from '@/components/shared/inputs/AppCheckbox';
import { AppTable } from '@/components/shared/table/AppTable';
import { GroupActionSection } from '@/components/user-management/GroupActionSection';
import { RoleBadge } from '@/components/user-management/RoleBadge';
import { UserEditForm } from '@/components/user-management/UserEditForm';
import { useUsersQuery } from '@/api/hooks/user-management/UserManagementApiHooks';
import { allowOnly } from '@/lib/guards';
import { cn } from '@/lib/utils';
import { getRoleLabel, Role } from '@/models/shared/Role';
import { User } from '@/models/shared/User';
import { useUserContext } from '@/providers/useUserContext';

export const Route = createFileRoute('/usermanagement')({
  component: UserManagementPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner),
});

type ModalStates =
  | { state: 'none' }
  | { state: 'newUserModal' }
  | { state: 'groupActionsModal' }
  | { state: 'editUserModal'; user: User };

const allowedRoles: Record<Role, Role[]> = {
  [Role.Administrator]: [Role.Administrator, Role.ShipOwner, Role.CruiseManager, Role.Guest, Role.ShipCrew],
  [Role.ShipOwner]: [Role.ShipOwner, Role.CruiseManager, Role.Guest, Role.ShipCrew],
  [Role.CruiseManager]: [],
  [Role.Guest]: [],
  [Role.ShipCrew]: [],
};

function UserManagementPage() {
  const userContext = useUserContext();
  const [selectedUsers, setSelectedUsers] = React.useState<RowSelectionState>({});
  const [modalState, setModalState] = React.useState<ModalStates>({ state: 'none' });
  const usersQuery = useUsersQuery();
  const currentUserRole = userContext.currentUser?.roles[0] as Role;

  async function handleModalClose() {
    setModalState({ state: 'none' });
    await usersQuery.refetch();
  }

  const columns: ColumnDef<User>[] = [
    {
      id: 'selector',
      header: ({ table }) => (
        <AppCheckbox
          name="selectAllUsers"
          onChange={(x) => table.toggleAllRowsSelected(x)}
          checked={table.getIsAllRowsSelected()}
          size="lg"
        />
      ),
      cell: ({ row }) => (
        <AppCheckbox
          name={`selectUser-${row.id}`}
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
      id: 'avatar',
      header: undefined,
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      cell: (cell) => <AppAvatar fullName={cell.getValue() as string} variant="small" />,
      enableColumnFilter: false,
      enableSorting: false,
      size: 5,
    },
    {
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: 'Imię i nazwisko',
      size: 30,
    },
    {
      accessorFn: (row) => row.email,
      header: 'Email',
      size: 25,
    },
    {
      id: 'accountStatus',
      accessorFn: (row) => (row.accepted ? 'Zaakceptowane' : 'Niezaakceptowane'),
      header: 'Stan Konta',
      cell: (cell) => {
        const value = cell.getValue() as 'Zaakceptowane' | 'Niezaakceptowane';
        return <AppBadge variant={value === 'Zaakceptowane' ? 'success' : 'danger'}>{value}</AppBadge>;
      },
      size: 10,
    },
    {
      id: 'emailStatus',
      accessorFn: (row) => (row.emailConfirmed ? 'Zweryfikowany' : 'Niezweryfikowany'),
      header: 'Stan Emaila',
      cell: (cell) => {
        const value = cell.getValue() as 'Zweryfikowany' | 'Niezweryfikowany';
        return <AppBadge variant={value === 'Zweryfikowany' ? 'success' : 'danger'}>{value}</AppBadge>;
      },
      size: 10,
    },
    {
      id: 'role',
      accessorFn: (row) => getRoleLabel(row.roles[0]),
      header: 'Rola',
      cell: ({ row }) => <RoleBadge role={row.original.roles[0]} />,
      size: 10,
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
      <AppLayout title="Zarządzanie użytkownikami">
        <AppTable
          data={usersQuery.data}
          columns={columns}
          rowSelectionState={selectedUsers}
          setRowSelectionState={setSelectedUsers}
          getRowId={(row) => row.id}
          buttons={(defaultButtons) => [
            <AppButton key="addUser" variant="primary" onClick={() => setModalState({ state: 'newUserModal' })}>
              Dodaj użytkownika
            </AppButton>,
            <AppButton
              key="groupActions"
              variant="warning"
              disabled={!Object.keys(selectedUsers).length}
              className={cn(!Object.keys(selectedUsers).length && 'opacity-50')}
              onClick={() => setModalState({ state: 'groupActionsModal' })}
            >
              Akcje Grupowe
            </AppButton>,
            ...defaultButtons,
          ]}
        />
      </AppLayout>

      <AppModal
        isOpen={modalState.state === 'newUserModal'}
        onClose={() => handleModalClose()}
        title="Dodaj użytkownika"
      >
        <UserEditForm
          allUsers={usersQuery.data}
          allowedRoles={allowedRoles[currentUserRole]}
          close={() => handleModalClose()}
          allowToRemoveUsers={false}
        />
      </AppModal>
      <AppModal
        isOpen={modalState.state === 'groupActionsModal' && Object.keys(selectedUsers).length > 0}
        onClose={() => handleModalClose()}
        title="Akcje grupowe"
      >
        <GroupActionSection
          selectedUsers={usersQuery.data.filter((user) => selectedUsers[user.id])}
          allUsers={usersQuery.data}
          allowToRemoveUsers={currentUserRole === Role.Administrator || currentUserRole === Role.ShipOwner}
          close={() => handleModalClose()}
        />
      </AppModal>
      <AppModal
        isOpen={modalState.state === 'editUserModal' && 'user' in modalState}
        onClose={() => handleModalClose()}
        title="Edytuj użytkownika"
      >
        <UserEditForm
          user={(modalState as { state: 'editUserModal'; user: User }).user}
          allUsers={usersQuery.data}
          allowedRoles={allowedRoles[currentUserRole]}
          close={() => handleModalClose()}
          allowToRemoveUsers={currentUserRole === Role.Administrator || currentUserRole === Role.ShipOwner}
        />
      </AppModal>
    </>
  );
}
