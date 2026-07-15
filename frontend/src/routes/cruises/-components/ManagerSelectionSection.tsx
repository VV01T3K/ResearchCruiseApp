import { useSelector } from '@tanstack/react-form';
import { AnimatePresence, motion } from 'motion/react';
import React from 'react';

import { AppAccordion } from '@/components/shared/AppAccordion';
import { AppAlert } from '@/components/shared/AppAlert';
import { AppDropdownInputOption } from '@/components/shared/inputs/AppDropdownInput';
import { mapPersonToLabel, mapPersonToText } from '@/lib/applications/PersonMappers';
import { useTypedAppFormContext } from '@/lib/form';
import { CruiseApplicationCandidate } from '@/routes/applications/$applicationId/-schemas/types/CruiseApplicationCandidate';
import { UserOption } from '@/routes/applications/$applicationId/-schemas/types/UserOption';
import { cruiseFormDefaultValues } from '@/routes/cruises/-schemas/form.schema';
import { useGetAvailableCruiseManagersSuspense } from '@/api/generated/endpoints/users.gen';
import type { CruiseManagerResponse, CruiseResponse } from '@/api/generated/schemas';

export function ManagerSelectionSection({
  cruise,
  cruiseApplications,
  isReadonly,
}: {
  cruise?: CruiseResponse;
  cruiseApplications: CruiseApplicationCandidate[];
  isReadonly: boolean;
}) {
  const form = useTypedAppFormContext({ defaultValues: cruiseFormDefaultValues });
  const usersQuery = useGetAvailableCruiseManagersSuspense();
  const cruiseApplicationsIds = useSelector(form.store, (state) => state.values.cruiseApplicationsIds);
  const selectedCruiseManagerId = useSelector(form.store, (state) => state.values.managersTeam.mainCruiseManagerId);
  const selectedDeputyManagerId = useSelector(form.store, (state) => state.values.managersTeam.mainDeputyManagerId);

  const users = React.useMemo(() => {
    if (!isReadonly) return getAllUsersForDropdown(usersQuery.data ?? [], cruiseApplications, cruiseApplicationsIds);
    const options: AppDropdownInputOption[] = [];
    if (cruise && selectedCruiseManagerId) {
      options.push(
        mapPersonToLabel({
          id: selectedCruiseManagerId,
          firstName: cruise.mainManager.firstName,
          lastName: cruise.mainManager.lastName,
          email: '',
        })
      );
    }
    if (cruise && selectedDeputyManagerId && selectedDeputyManagerId !== selectedCruiseManagerId) {
      options.push(
        mapPersonToLabel({
          id: selectedDeputyManagerId,
          firstName: cruise.deputyManager.firstName,
          lastName: cruise.deputyManager.lastName,
          email: '',
        })
      );
    }
    return options;
  }, [
    cruise,
    cruiseApplications,
    cruiseApplicationsIds,
    isReadonly,
    selectedCruiseManagerId,
    selectedDeputyManagerId,
    usersQuery.data,
  ]);

  const cruiseManagersNotAssignedToApplication = React.useMemo(
    () =>
      isReadonly
        ? []
        : getCruiseManagersNotAssignedToApplication(
            usersQuery.data ?? [],
            [selectedCruiseManagerId, selectedDeputyManagerId],
            cruiseApplications,
            cruiseApplicationsIds
          ),
    [
      cruiseApplications,
      cruiseApplicationsIds,
      isReadonly,
      selectedCruiseManagerId,
      selectedDeputyManagerId,
      usersQuery.data,
    ]
  );

  return (
    <AppAccordion title="3. Kierownik główny i zastępca kierownika głównego" expandedByDefault>
      {!isReadonly && (
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
      )}

      <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
        <form.AppField
          name="managersTeam.mainCruiseManagerId"
          children={(field) => (
            <field.SelectField
              allOptions={users}
              label="Kierownik główny"
              placeholder="Wybierz kierownika głównego"
              disabled={isReadonly}
            />
          )}
        />

        <form.AppField
          name="managersTeam.mainDeputyManagerId"
          children={(field) => (
            <field.SelectField
              allOptions={users}
              label="Zastępca kierownika głównego"
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
  cruiseApplications: CruiseApplicationCandidate[],
  selectedCruiseApplicationsIds: string[]
) {
  return cruiseApplications.some(
    (application) =>
      (selectedCruiseApplicationsIds.includes(application.id) && application.cruiseManagerId === managerId) ||
      application.deputyManagerId === managerId
  );
}

function getCruiseManagersNotAssignedToApplication(
  users: CruiseManagerResponse[],
  selectedUsersIds: string[],
  cruiseApplications: CruiseApplicationCandidate[],
  selectedCruiseApplicationsIds: string[]
): CruiseManagerResponse[] {
  return selectedUsersIds
    .map((userId) => users.find((user) => user.id === userId))
    .filter((user) => {
      if (user === undefined) return false;
      return !checkIfCruiseManagerIsAssignedToAnyApplication(
        user.id,
        cruiseApplications,
        selectedCruiseApplicationsIds
      );
    })
    .filter((user): user is CruiseManagerResponse => user !== undefined);
}

function getAllUsersForDropdown(
  users: CruiseManagerResponse[],
  cruiseApplications: CruiseApplicationCandidate[],
  selectedCruiseApplicationsIds: string[]
): AppDropdownInputOption[] {
  const formUsers: UserOption[] = users.map((user) => ({
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
