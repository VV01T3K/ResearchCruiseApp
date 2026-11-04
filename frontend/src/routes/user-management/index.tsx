import { createFileRoute } from '@tanstack/react-router';
import { allowOnly } from '@/lib/guards';
import { Role, getRoleLabel } from '@/integrations/auth/types';
import { RowSelectionState } from '@tanstack/react-table';
import { ColumnDef } from '@/integrations/tanstack/table/features';
import React from 'react';
import { Avatar } from '@/components/shared/Avatar';
import { Badge } from '@/components/shared/Badge';
import { Button } from '@/components/shared/Button';
import { Layout } from '@/components/shared/Layout';
import { Modal } from '@/components/shared/Modal';
import { Checkbox } from '@/components/shared/inputs/Checkbox';
import { Table } from '@/components/shared/table/Table';
import { cn } from '@/lib/utils';
import type { UserResponse } from '@/api/generated/schemas';
import { useCurrentUser } from '@/integrations/tanstack/query/auth';
import { GroupActionsSection } from './-components/GroupActionsSection';
import { RoleBadge } from './-components/RoleBadge';
import { EditForm } from './-components/EditForm';
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
    {
      id: 'selector',
      header: ({ table }) => (
        <Checkbox
          aria-label="Zaznacz wszystkich użytkowników"
          name="selectAllUsers"
          onChange={(x) => table.toggleAllRowsSelected(x)}
          checked={table.getIsAllRowsSelected()}
          size="lg"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          aria-label={`Zaznacz użytkownika ${row.original.firstName} ${row.original.lastName}`}
          name={`selectUser-${row.id}`}
          checked={row.getIsSelected()}
          disabled={!row.getCanSelect()}
          onChange={(checked) => row.toggleSelected(checked)}
          className="inline-block"
          size="md"
        />
      ),
      enableSorting: false,
      enableColumnFilter: false,
      size: 60,
    },
    {
      id: 'avatar',
      header: () => <span className="sr-only">Zdjęcie</span>,
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      cell: (cell) => <Avatar fullName={cell.getValue() as string} variant="small" />,
      enableColumnFilter: false,
      enableSorting: false,
      size: 60,
    },
    {
      accessorFn: (row) => `${row.firstName} ${row.lastName}`,
      header: 'Imię i nazwisko',
      size: 318,
    },
    {
      accessorFn: (row) => row.email,
      header: 'Email',
      size: 290,
    },
    {
      id: 'accountStatus',
      accessorFn: (row) => (row.accepted ? 'Zaakceptowane' : 'Niezaakceptowane'),
      header: 'Stan Konta',
      cell: (cell) => {
        const value = cell.getValue() as 'Zaakceptowane' | 'Niezaakceptowane';
        return <Badge variant={value === 'Zaakceptowane' ? 'success' : 'danger'}>{value}</Badge>;
      },
      size: 145,
    },
    {
      id: 'emailStatus',
      accessorFn: (row) => (row.emailConfirmed ? 'Zweryfikowany' : 'Niezweryfikowany'),
      header: 'Stan Emaila',
      cell: (cell) => {
        const value = cell.getValue() as 'Zweryfikowany' | 'Niezweryfikowany';
        return <Badge variant={value === 'Zweryfikowany' ? 'success' : 'danger'}>{value}</Badge>;
      },
      size: 140,
    },
    {
      id: 'role',
      accessorFn: (row) => getRoleLabel(row.roles[0]),
      header: 'Rola',
      cell: ({ row }) => <RoleBadge role={row.original.roles[0]} />,
      size: 125,
    },
    {
      id: 'actions',
      header: () => <span className="sr-only">Akcje</span>,
      cell: (cell) => (
        <div className="flex items-center justify-around">
          <Button variant="primary" onClick={() => setModalState({ state: 'editUserModal', user: cell.row.original })}>
            Edytuj
          </Button>
        </div>
      ),
      size: 112,
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
              variant="warning"
              disabled={!Object.keys(selectedUsers).length}
              className={cn(!Object.keys(selectedUsers).length && 'opacity-50')}
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
