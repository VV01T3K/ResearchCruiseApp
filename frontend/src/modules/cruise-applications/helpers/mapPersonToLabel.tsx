import { AppAvatar } from '@/core/components/AppAvatar';
import { AppDropdownInputOption } from '@/core/components/inputs/AppDropdownInput';
import { FormUserDto } from '@/cruise-applications/models/FormUserDto';

export function mapPersonToLabel(person: FormUserDto): AppDropdownInputOption {
  return {
    value: person.id,
    inlineLabel: `${person.firstName} ${person.lastName} (${person.email})`,
    richLabel: (
      <div className="w-full flex gap-4">
        <AppAvatar fullName={`${person.firstName} ${person.lastName}`} variant="small" />
        <div className="flex flex-col justify-center flex-1">
          <div className="font-semibold">
            {person.firstName} {person.lastName}
          </div>
          <div>{person.email}</div>
        </div>
      </div>
    ),
  };
}
