// The API's id for an unassigned person.
export const emptyGuid = '00000000-0000-0000-0000-000000000000';

const UNKNOWN_PERSON = 'Nieznany użytkownik';

type Person = { id: string; firstName: string; lastName: string };

export function isUnassignedPerson(person: Person | undefined): boolean {
  return !person || person.id === emptyGuid;
}

export function getPersonName(person: Person | undefined): string {
  if (!person || isUnassignedPerson(person)) {
    return '';
  }
  return `${person.firstName} ${person.lastName}`.trim() || UNKNOWN_PERSON;
}
