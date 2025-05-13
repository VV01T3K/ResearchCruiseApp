import { useStore } from '@tanstack/react-form';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppAlert } from '@/core/components/AppAlert';
import { AppDropdownInput, AppDropdownInputOption } from '@/core/components/inputs/AppDropdownInput';
import { getErrors } from '@/core/lib/utils';
import { mapPersonToLabel } from '@/cruise-applications/helpers/PersonMappers';
import { CruiseApplicationDto } from '@/cruise-applications/models/CruiseApplicationDto';
import { FormUserDto } from '@/cruise-applications/models/FormUserDto';
import { useCruiseForm } from '@/cruise-schedule/contexts/CruiseFormContext';

export function CruiseFormManagerSelectionSection() {
  const { form, cruiseApplications, isReadonly, hasFormBeenSubmitted } = useCruiseForm();

  const cruiseApplicationsIds = useStore(form.store, (state) => state.values.cruiseApplicationsIds);
  const allowedUsers = React.useMemo(() => {
    return getDropdownUsersForApplications(cruiseApplications ?? [], cruiseApplicationsIds);
  }, [cruiseApplications, cruiseApplicationsIds]);

  // Clear selected managers if they are not listed in the selected applications
  React.useEffect(() => {
    const allowedUsersIds = allowedUsers.map((user) => user.value);
    if (!allowedUsersIds.includes(form.state.values.managersTeam.mainCruiseManagerId)) {
      form.setFieldValue('managersTeam.mainCruiseManagerId', '');
    }
    if (!allowedUsersIds.includes(form.state.values.managersTeam.mainDeputyManagerId)) {
      form.setFieldValue('managersTeam.mainDeputyManagerId', '');
    }
  }, [allowedUsers, form]);

  return (
    <AppAccordion title="3. Kierownik główny i zastępca kierownika głównego" expandedByDefault>
      <AnimatePresence initial={cruiseApplicationsIds.length !== 0}>
        {cruiseApplicationsIds.length === 0 && (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ ease: 'easeOut' }}
          >
            <AppAlert>Brak zgłoszeń przypisanych do rejsu, nie można wybrać kierowników.</AppAlert>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        <form.Field
          name="managersTeam.mainCruiseManagerId"
          children={(field) => (
            <AppDropdownInput
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
              allOptions={allowedUsers}
              label="Kierownik główny"
              required
              placeholder="Wybierz kierownika głównego"
              disabled={isReadonly || cruiseApplicationsIds.length === 0}
            />
          )}
        />

        <form.Field
          name="managersTeam.mainDeputyManagerId"
          children={(field) => (
            <AppDropdownInput
              name={field.name}
              value={field.state.value}
              onChange={field.handleChange}
              onBlur={field.handleBlur}
              errors={getErrors(field.state.meta, hasFormBeenSubmitted)}
              allOptions={allowedUsers}
              label="Zastępca kierownika głównego"
              required
              placeholder="Wybierz zastępcę kierownika głównego"
              disabled={isReadonly || cruiseApplicationsIds.length === 0}
            />
          )}
        />
      </div>
    </AppAccordion>
  );
}

function getDropdownUsersForApplications(
  cruiseApplications: CruiseApplicationDto[],
  selectedApplicationIds: string[]
): AppDropdownInputOption[] {
  const filteredApplications = cruiseApplications.filter((application) =>
    selectedApplicationIds.includes(application.id)
  );

  const users = filteredApplications.reduce((acc, application) => {
    const manager = {
      id: application.cruiseManagerId,
      firstName: application.cruiseManagerFirstName,
      lastName: application.cruiseManagerLastName,
      email: application.cruiseManagerEmail,
    };

    const deputy = {
      id: application.deputyManagerId,
      firstName: application.deputyManagerFirstName,
      lastName: application.deputyManagerLastName,
      email: application.deputyManagerEmail,
    };

    if (!acc.some((user) => user.id === manager.id)) {
      acc.push(manager);
    }

    if (!acc.some((user) => user.id === deputy.id)) {
      acc.push(deputy);
    }

    return acc;
  }, [] as FormUserDto[]);

  return users.reduce((acc, user) => {
    acc.push(mapPersonToLabel(user));
    return acc;
  }, [] as AppDropdownInputOption[]);
}
