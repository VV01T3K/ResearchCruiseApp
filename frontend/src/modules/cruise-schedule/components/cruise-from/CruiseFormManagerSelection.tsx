import { useStore } from '@tanstack/react-form';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppAccordion } from '@/core/components/AppAccordion';
import { AppAlert } from '@/core/components/AppAlert';
import { AppDropdownInput, AppDropdownInputOption } from '@/core/components/inputs/AppDropdownInput';
import { getErrors } from '@/core/lib/utils';
import { User } from '@/core/models/User';
import { mapPersonToLabel, mapPersonToText } from '@/cruise-applications/helpers/PersonMappers';
import { CruiseApplicationDto } from '@/cruise-applications/models/CruiseApplicationDto';
import { FormUserDto } from '@/cruise-applications/models/FormUserDto';
import { useCruiseForm } from '@/cruise-schedule/contexts/CruiseFormContext';
import { useUsersQuery } from '@/usermanagement/hooks/UserManagementApiHooks';

export function CruiseFormManagerSelectionSection() {
  const { form, cruiseApplications, isReadonly, hasFormBeenSubmitted } = useCruiseForm();
  const usersQuery = useUsersQuery();

  const cruiseApplicationsIds = useStore(form.store, (state) => state.values.cruiseApplicationsIds);
  const selectedCruiseManagerId = useStore(form.store, (state) => state.values.managersTeam.mainCruiseManagerId);
  const selectedDeputyManagerId = useStore(form.store, (state) => state.values.managersTeam.mainDeputyManagerId);

  const users = React.useMemo(() => {
    return getAllUsersForDropdown(usersQuery.data ?? [], cruiseApplications, form.state.values.cruiseApplicationsIds);
  }, [usersQuery.data, cruiseApplications, form.state.values.cruiseApplicationsIds]);

  const cruiseManagersNotAssignedToApplication = React.useMemo(
    () =>
      getCruiseManagersNotAssignedToApplication(
        usersQuery.data,
        [selectedCruiseManagerId, selectedDeputyManagerId],
        cruiseApplications,
        cruiseApplicationsIds
      ),
    [cruiseApplications, cruiseApplicationsIds, selectedCruiseManagerId, selectedDeputyManagerId, usersQuery.data]
  );

  return (
    <AppAccordion title="3. Kierownik główny i zastępca kierownika głównego" expandedByDefault>
      <AnimatePresence initial={cruiseApplicationsIds.length !== 0}>
        {cruiseManagersNotAssignedToApplication.length > 0 && (
          <motion.div
            className="mt-2"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ ease: 'easeOut' }}
          >
            <AppAlert variant="warning">
              Nie przypisano {cruiseManagersNotAssignedToApplication.map(mapPersonToText).join(' i ')} do żadnego
              zgłoszenia dołączonego do rejsu.
            </AppAlert>
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
              allOptions={users}
              label="Kierownik główny"
              required
              placeholder="Wybierz kierownika głównego"
              disabled={isReadonly}
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
              allOptions={users}
              label="Zastępca kierownika głównego"
              required
              placeholder="Wybierz zastępcę kierownika głównego"
              disabled={isReadonly}
            />
          )}
        />
      </div>
    </AppAccordion>
  );
}

function checkIfCruiseManagerIsAssignedToAnyApplication(
  managerId: string,
  cruiseApplications: CruiseApplicationDto[],
  selectedCruiseApplicationsIds: string[]
) {
  return cruiseApplications.some(
    (application) =>
      (selectedCruiseApplicationsIds.includes(application.id) && application.cruiseManagerId === managerId) ||
      application.deputyManagerId === managerId
  );
}

function getCruiseManagersNotAssignedToApplication(
  users: User[],
  selectedUsersIds: string[],
  cruiseApplications: CruiseApplicationDto[],
  selectedCruiseApplicationsIds: string[]
): User[] {
  return selectedUsersIds
    .map((userId) => users.find((user) => user.id === userId))
    .filter((user) => {
      if (user === undefined) return false;
      return !checkIfCruiseManagerIsAssignedToAnyApplication(
        user.id,
        cruiseApplications,
        selectedCruiseApplicationsIds
      );
    }) as User[];
}

function getAllUsersForDropdown(
  users: User[],
  cruiseApplications: CruiseApplicationDto[],
  selectedCruiseApplicationsIds: string[]
): AppDropdownInputOption[] {
  const formUsers: FormUserDto[] = users.map((user) => ({
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
  }));

  const assignedUserIds = new Set<string>();
  cruiseApplications.forEach((application) => {
    if (selectedCruiseApplicationsIds.includes(application.id)) {
      if (application.cruiseManagerId) {
        assignedUserIds.add(application.cruiseManagerId);
      }
      if (application.deputyManagerId) {
        assignedUserIds.add(application.deputyManagerId);
      }
    }
  });

  const assignedUsers = formUsers.filter((user) => assignedUserIds.has(user.id));
  const unassignedUsers = formUsers.filter((user) => !assignedUserIds.has(user.id));

  const sortedUsers = [...assignedUsers, ...unassignedUsers];

  return sortedUsers.map(mapPersonToLabel);
}
