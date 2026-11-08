import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { Role, getRoleLabel } from '@/integrations/auth/types';
import { RowSelectionState } from '@tanstack/react-table';
import { ColumnDef } from '@/integrations/tanstack/table/features';
import React from 'react';
import { Button } from '@/components/shared/Button';
import { Layout } from '@/components/shared/Layout';
import { Modal } from '@/components/shared/Modal';
import { Table } from '@/components/shared/table/Table';
import type { UserResponse } from '@/api/generated/schemas';
import { useCurrentUser } from '@/integrations/tanstack/query/auth';
import { GroupActionsSection } from './-components/GroupActionsSection';
import { EditForm } from './-components/EditForm';
import {
  AccountStatusCell,
  ActionsHeader,
  AvatarHeader,
  EmailStatusCell,
  SelectAllUsersHeader,
  SelectUserCell,
  UserAvatarCell,
  UserRoleCell,
} from './-components/UserTableCells';
import { useGetUsersSuspense } from '@/api/generated/endpoints/users.gen';

export const Route = createFileRoute('/user-management/')({
  component: UserManagementPage,
  beforeLoad: allowOnly.withRoles(Role.Administrator, Role.ShipOwner),
});

type ModalStates =
  | { state: 'none' }
  | { state: 'newUserModal' }
  | { state: 'groupActionsModal' }
  | { state: 'editUserModal'; user: UserResponse };

const allowedRoles: Record<Role, Role[]> = {
  [Role.Administrator]: [Role.Administrator, Role.ShipOwner, Role.CruiseManager, Role.Guest, Role.ShipCrew],
  [Role.ShipOwner]: [Role.CruiseManager, Role.Guest, Role.ShipCrew],
  [Role.CruiseManager]: [],
  [Role.Guest]: [],
  [Role.ShipCrew]: [],
};

const userColumns: ColumnDef<UserResponse>[] = [
  {
    id: 'selector',
    header: SelectAllUsersHeader,
    cell: SelectUserCell,
    enableSorting: false,
    enableColumnFilter: false,
    size: 40,
  },
  {
    id: 'avatar',
    header: AvatarHeader,
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    cell: UserAvatarCell,
    enableColumnFilter: false,
    enableSorting: false,
    size: 56,
  },
  {
    accessorFn: (row) => `${row.firstName} ${row.lastName}`,
    header: 'Imię i nazwisko',
    size: 194,
  },
  {
    accessorFn: (row) => row.email,
    header: 'Email',
    size: 184,
  },
  {
    id: 'accountStatus',
    accessorFn: (row) => (row.accepted ? 'Zaakceptowane' : 'Niezaakceptowane'),
    header: 'Stan Konta',
    cell: AccountStatusCell,
    size: 134,
  },
  {
    id: 'emailStatus',
    accessorFn: (row) => (row.emailConfirmed ? 'Zweryfikowany' : 'Niezweryfikowany'),
    header: 'Stan Emaila',
    cell: EmailStatusCell,
    size: 130,
  },
  {
    id: 'role',
    accessorFn: (row) => getRoleLabel(row.roles[0]),
    header: 'Rola',
    cell: UserRoleCell,
    size: 106,
  },
];

function UserManagementPage() {
  const currentUser = useCurrentUser();
  const [selectedUsers, setSelectedUsers] = React.useState<RowSelectionState>({});
  const [modalState, setModalState] = React.useState<ModalStates>({ state: 'none' });
  const usersQuery = useGetUsersSuspense({
    query: { select: (users) => users.map((user) => ({ ...user, roles: user.roles as Role[] })) },
  });
  const currentUserRole = currentUser?.roles[0] as Role;

  async function handleModalClose() {
    setModalState({ state: 'none' });
    await usersQuery.refetch();
  }

  const columns: ColumnDef<UserResponse>[] = [
    ...userColumns,
    {
      id: 'actions',
      header: ActionsHeader,
      cell: ({ row }) => (
        <div className="flex items-center justify-around">
          <Button variant="primary" onClick={() => setModalState({ state: 'editUserModal', user: row.original })}>
            Edytuj
          </Button>
        </div>
      ),
      size: 100,
    },
  ];

  return (
    <>
      <Layout title="Zarządzanie użytkownikami">
        <Table
          data={usersQuery.data}
          virtualized
          columns={columns}
          rowSelectionState={selectedUsers}
          setRowSelectionState={setSelectedUsers}
          getRowId={(row) => row.id}
          buttons={(defaultButtons) => [
            <Button key="addUser" variant="primary" onClick={() => setModalState({ state: 'newUserModal' })}>
              Dodaj użytkownika
            </Button>,
            <Button
              key="groupActions"
              variant="primaryOutline"
              disabled={!Object.keys(selectedUsers).length}
              onClick={() => setModalState({ state: 'groupActionsModal' })}
            >
              Akcje Grupowe
            </Button>,
            ...defaultButtons,
          ]}
        />
      </Layout>

      <Modal
        isOpen={modalState.state === 'newUserModal'}
        onClose={() => void handleModalClose()}
        title="Dodaj użytkownika"
      >
        <EditForm
          allUsers={usersQuery.data}
          allowedRoles={allowedRoles[currentUserRole]}
          close={() => void handleModalClose()}
          allowToRemoveUsers={false}
        />
      </Modal>
      <Modal
        isOpen={modalState.state === 'groupActionsModal' && Object.keys(selectedUsers).length > 0}
        onClose={() => void handleModalClose()}
        title="Akcje grupowe"
      >
        <GroupActionsSection
          selectedUsers={usersQuery.data.filter((user) => selectedUsers[user.id])}
          allUsers={usersQuery.data}
          allowToRemoveUsers={currentUserRole === Role.Administrator || currentUserRole === Role.ShipOwner}
          close={() => void handleModalClose()}
        />
      </Modal>
      <Modal
        isOpen={modalState.state === 'editUserModal' && 'user' in modalState}
        onClose={() => void handleModalClose()}
        title="Edytuj użytkownika"
        className="max-w-2xl"
      >
        <EditForm
          user={(modalState as { state: 'editUserModal'; user: UserResponse }).user}
          allUsers={usersQuery.data}
          allowedRoles={allowedRoles[currentUserRole]}
          close={() => void handleModalClose()}
          allowToRemoveUsers={currentUserRole === Role.Administrator || currentUserRole === Role.ShipOwner}
        />
      </Modal>
    </>
  );
}
