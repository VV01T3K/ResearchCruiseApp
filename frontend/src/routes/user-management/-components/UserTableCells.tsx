import { Subscribe } from '@tanstack/react-table';
import type { UserResponse } from '@/api/generated/schemas';
import { Avatar } from '@/components/shared/Avatar';
import { Badge } from '@/components/shared/Badge';
import { Checkbox } from '@/components/shared/inputs/Checkbox';
import type { Row, Table } from '@/integrations/tanstack/table/features';
import { RoleBadge } from './RoleBadge';

export function SelectAllUsersHeader({ table }: { table: Table<UserResponse> }) {
  return (
    <Subscribe source={table.atoms.rowSelection} selector={() => table.getIsAllRowsSelected()}>
      {(allSelected) => (
        <Checkbox
          aria-label="Zaznacz wszystkich użytkowników"
          name="selectAllUsers"
          onChange={(x) => table.toggleAllRowsSelected(x)}
          checked={allSelected}
          size="lg"
        />
      )}
    </Subscribe>
  );
}

export function SelectUserCell({ row }: { row: Row<UserResponse> }) {
  return (
    <Subscribe source={row.table.atoms.rowSelection} selector={(selection) => !!selection[row.id]}>
      {(selected) => (
        <Checkbox
          aria-label={`Zaznacz użytkownika ${row.original.firstName} ${row.original.lastName}`}
          name={`selectUser-${row.id}`}
          checked={selected}
          disabled={!row.getCanSelect()}
          onChange={(checked) => row.toggleSelected(checked)}
          className="inline-block"
          size="md"
        />
      )}
    </Subscribe>
  );
}

export function AvatarHeader() {
  return <span className="sr-only">Zdjęcie</span>;
}

export function UserAvatarCell({ row }: { row: Row<UserResponse> }) {
  return <Avatar fullName={`${row.original.firstName} ${row.original.lastName}`} variant="small" />;
}

export function AccountStatusCell({ row }: { row: Row<UserResponse> }) {
  return row.original.accepted ? (
    <Badge variant="success">Zaakceptowane</Badge>
  ) : (
    <Badge variant="danger">Niezaakceptowane</Badge>
  );
}

export function EmailStatusCell({ row }: { row: Row<UserResponse> }) {
  return row.original.emailConfirmed ? (
    <Badge variant="success">Zweryfikowany</Badge>
  ) : (
    <Badge variant="danger">Niezweryfikowany</Badge>
  );
}

export function UserRoleCell({ row }: { row: Row<UserResponse> }) {
  return <RoleBadge role={row.original.roles[0]} />;
}

export function ActionsHeader() {
  return <span className="sr-only">Akcje</span>;
}
