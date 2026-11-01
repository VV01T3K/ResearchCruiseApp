import { getUserAssignments } from '@/api/generated/endpoints/users.gen';
import type { UserAssignmentsResponse, UserResponse } from '@/api/generated/schemas';
import { Alert } from '@/components/shared/Alert';
import { Link } from '@/components/shared/Link';
import { getApplicationStatusLabel } from '@/lib/applications/status';

export type UserAssignments = { user: UserResponse; assignments: UserAssignmentsResponse };

export async function findActiveAssignments(users: UserResponse[]): Promise<UserAssignments[] | null> {
  try {
    const results = await Promise.all(
      users.map(async (user) => ({ user, assignments: await getUserAssignments(user.id) }))
    );
    return results.filter(({ assignments }) => assignments.applications.length + assignments.cruises.length > 0);
  } catch {
    return null;
  }
}

type Props = {
  items: UserAssignments[] | null;
  action: 'role' | 'deactivate';
  group?: boolean;
};
export function AssignmentsWarning({ items, action, group }: Props) {
  if (!items) {
    return (
      <Alert variant="warning" iconAlign="start">
        Nie udało się sprawdzić zgłoszeń i rejsów prowadzonych przez {group ? 'użytkowników' : 'użytkownika'}. Mogą
        wśród nich być aktywne zgłoszenia lub rejsy.
      </Alert>
    );
  }

  const several = items.length > 1;

  return (
    <Alert variant="warning" iconAlign="start">
      <div className="space-y-2">
        <p className="font-semibold">
          {several ? 'Ci użytkownicy prowadzą' : 'Ten użytkownik prowadzi'} aktywne zgłoszenia lub rejsy
        </p>
        {items.map(({ user, assignments }) => (
          <div key={user.id}>
            {(group || several) && (
              <p className="font-medium">
                {user.firstName} {user.lastName}
              </p>
            )}
            <ul className="list-disc ps-5">
              {assignments.applications.map((application) => (
                <li key={application.id}>
                  <Link href={`/applications/${application.id}`} target="_blank">
                    Zgłoszenie nr {application.number}
                  </Link>{' '}
                  ({application.isDeputy ? 'zastępca' : 'kierownik'}): {getApplicationStatusLabel(application.status)}
                </li>
              ))}
              {assignments.cruises.map((cruise) => (
                <li key={cruise.id}>
                  <Link href={`/cruises/${cruise.id}`} target="_blank">
                    Rejs nr {cruise.number}
                  </Link>{' '}
                  ({cruise.isDeputy ? 'zastępca' : 'kierownik'}): {cruise.status === 'new' ? 'Nowy' : 'Potwierdzony'}
                </li>
              ))}
            </ul>
            {assignments.closedCount > 0 && (
              <p className="text-sm">Zamknięte zgłoszenia i rejsy ({assignments.closedCount}) pozostaną bez zmian.</p>
            )}
          </div>
        ))}
        <p>
          {action === 'role' ? 'Po zmianie roli' : 'Po cofnięciu akceptacji'} {several ? 'stracą' : 'straci'} możliwość
          ich edycji. Formularze B i C może dokończyć zastępca kierownika lub administrator.
        </p>
      </div>
    </Alert>
  );
}
