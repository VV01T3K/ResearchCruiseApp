import { AppAvatar } from '@/components/shared/AppAvatar';
import { AppDropdownInputOption } from '@/components/shared/inputs/AppDropdownInput';
import { UserOption } from '@/api/generated/schemas';

export function mapPersonToLabel(person: UserOption): AppDropdownInputOption {
  return {
    value: person.id,
    inlineLabel: mapPersonToText(person),
    richLabel: (
      <div className="flex w-full gap-4">
        <AppAvatar fullName={`${person.firstName} ${person.lastName}`} variant="small" />
        <div className="flex flex-1 flex-col justify-center">
          <div className="font-semibold">
            {person.firstName} {person.lastName}
          </div>
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
  const name = `${person.firstName} ${person.lastName}`;
  return person.email ? `${name} (${person.email})` : name;
}
