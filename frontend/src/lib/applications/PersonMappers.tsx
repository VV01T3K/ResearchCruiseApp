import { AppAvatar } from '@/components/shared/AppAvatar';
import { AppDropdownInputOption } from '@/components/shared/inputs/AppDropdownInput';
import { UserOption } from '@/api/generated/schemas';

/** Shown when the API returns no name, as it does for a person whose account was deleted. */
const UNKNOWN_PERSON = 'Nieznany użytkownik';

export function mapPersonToLabel(person: UserOption): AppDropdownInputOption {
  const fullName = getFullName(person);
  return {
    value: person.id,
    inlineLabel: mapPersonToText(person),
    richLabel: (
      <div className="flex w-full gap-4">
        <AppAvatar fullName={fullName} variant="small" />
        <div className="flex flex-1 flex-col justify-center">
          <div className="font-semibold">{fullName || UNKNOWN_PERSON}</div>
          {person.email && <div>{person.email}</div>}
        </div>
      </div>
    ),
  };
}

export function mapPersonToText(person: UserOption | undefined): string {
  if (!person) {
    return '';
  }
  const name = getFullName(person) || UNKNOWN_PERSON;
  return person.email ? `${name} (${person.email})` : name;
}

function getFullName(person: UserOption): string {
  return `${person.firstName} ${person.lastName}`.trim();
}
