import { AppAvatar } from '@/core/components/AppAvatar';
import { AppDropdownInputOption } from '@/core/components/inputs/AppDropdownInput';
import { FormUserDto } from '@/cruise-applications/models/FormUserDto';

export function mapPersonToLabel(person: FormUserDto): AppDropdownInputOption {
  return {
    value: person.id,
    inlineLabel: `${person.firstName} ${person.lastName} (${person.email})`,
    richLabel: (
      <div className="flex w-full gap-4">
        <AppAvatar fullName={`${person.firstName} ${person.lastName}`} variant="small" />
        <div className="flex flex-1 flex-col justify-center">
          <div className="font-semibold">
            {person.firstName} {person.lastName}
          </div>
          <div>{person.email}</div>
        </div>
      </div>
    ),
  };
}

export function mapPersonToText(person: FormUserDto | undefined): string {
  if (!person) {
    return '';
  }
  return `${person.firstName} ${person.lastName} (${person.email})`;
}
