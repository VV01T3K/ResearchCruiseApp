import { Avatar } from '@/components/shared/Avatar';
import type { ComboboxInputOption } from '@/components/inputs/ComboboxInput';
import { UserOption } from '@/api/generated/schemas';
import { getPersonName } from '@/lib/applications/person';

export function mapPersonToLabel(person: UserOption): ComboboxInputOption {
  const fullName = `${person.firstName} ${person.lastName}`.trim();
  return {
    value: person.id,
    label: mapPersonToText(person),
    richLabel: (
      <div className="flex w-full gap-4">
        <Avatar fullName={fullName} variant="small" />
        <div className="flex flex-1 flex-col justify-center">
          <div className="font-semibold">{getPersonName(person)}</div>
          {person.email && <div>{person.email}</div>}
        </div>
      </div>
    ),
  };
}

export function mapPersonToText(person: UserOption | undefined): string {
  const name = getPersonName(person);
  return name && person?.email ? `${name} (${person.email})` : name;
}
