/** The id the API uses for a person who is not assigned, such as an application without a deputy. */
export const emptyGuid = '00000000-0000-0000-0000-000000000000';

/** Shown when the API returns no name, as it does for a person whose account was deleted. */
const UNKNOWN_PERSON = 'Nieznany użytkownik';

type Person = { id: string; firstName: string; lastName: string };

export function isUnassignedPerson(person: Person | undefined): person is undefined {
  return !person || person.id === emptyGuid;
}

/** The person's full name, an empty string when nobody is assigned, or a placeholder for a deleted account. */
export function getPersonName(person: Person | undefined): string {
  if (isUnassignedPerson(person)) {
    return '';
  }
  return `${person.firstName} ${person.lastName}`.trim() || UNKNOWN_PERSON;
}
