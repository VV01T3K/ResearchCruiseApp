import { Avatar } from '@/components/shared/Avatar';
import { DropdownInputOption } from '@/components/shared/inputs/DropdownInput';
import { UserOption } from '@/api/generated/schemas';
import { getPersonName } from '@/lib/applications/person';

export function mapPersonToLabel(person: UserOption): DropdownInputOption {
  const fullName = `${person.firstName} ${person.lastName}`.trim();
  return {
    value: person.id,
    inlineLabel: mapPersonToText(person),
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
