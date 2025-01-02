import {useEffect, useState} from 'react';
import FormTemplate from '../FormPage/Wrappers/FormTemplate';
import {ApplicationsSection} from './CruiseFormSections/Sections/AppicationsSection';
import {InfoSection} from './CruiseFormSections/Sections/InfoSection';
import {CruiseManagersSection} from './CruiseFormSections/Sections/CruiseManagersSection';
import {Cruise} from 'Cruise';
import {DateSection} from './CruiseFormSections/Sections/DateSection';
import {CruiseFormBottomOptionBar} from '../../../ToBeMoved/Tools/CruiseFormBottomOptionBar';
import {FormType, FormTypeKeys,} from '../../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation';
import {CruiseApplication} from 'CruiseApplication';
import {CruiseStatus} from '@enums/CruiseStatus';
import {EMPTY_GUID} from '@consts/emptyGuid';
import {ApplicationsContext} from '@contexts/ApplicationsContext';
import {cruiseFromLocation} from '@hooks/cruiseFromLocation';
import {getCruiseApplicationsForCruise} from '@api/requests';

const CruiseFormSections = () => [
  InfoSection(),
  DateSection(),
  CruiseManagersSection(),
  ApplicationsSection(),
];

const EditCruiseFormDefaultValues = (cruise?: Cruise) => {
  if (cruise) {
    return {
      startDate: cruise.startDate,
      endDate: cruise.endDate,
      managersTeam: {
        mainCruiseManagerId: cruise.mainCruiseManagerId,
        mainDeputyManagerId: cruise.mainDeputyManagerId,
      },
      cruiseApplicationsIds: cruise.cruiseApplicationsShortInfo.map(
        (app) => app.id
      ),
    };
  }
  return {
    startDate: undefined,
    endDate: undefined,
    managersTeam: {
      mainCruiseManagerId: EMPTY_GUID,
      mainDeputyManagerId: EMPTY_GUID,
    },
    cruiseApplicationsIds: [],
  };
};

export default function CruiseFormPage() {
  const cruise = cruiseFromLocation();
  const editCruiseFormDefaultValues = EditCruiseFormDefaultValues(cruise);
  const sections = CruiseFormSections();

  const cruiseIsNew = !cruise || cruise?.status == CruiseStatus.New;
  const [fetchedCruiseApplications, setFetchedCruiseApplications] = useState<
    CruiseApplication[]
  >([]);
  useEffect(() => {
    // if (fetchedCruiseApplications.length <= 0) {
    getCruiseApplicationsForCruise(cruiseIsNew).then((response) =>
      setFetchedCruiseApplications(response?.data ?? [])
    );
    // }
  }, []);

  return (
    <ApplicationsContext.Provider value={fetchedCruiseApplications}>
      <FormTemplate
        sections={sections}
        type={FormType.CruiseDetails as FormTypeKeys}
        BottomOptionBar={CruiseFormBottomOptionBar}
        defaultValues={editCruiseFormDefaultValues}
      />
    </ApplicationsContext.Provider>
  );
}
