import FormTemplate from '../../Wrappers/FormTemplate';
import {useEffect, useState} from 'react';
import {CruiseInfoSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/CruiseInfoSection';
import {CruiseManagersSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/CruiseManagersSection';
import {CruiseUsageSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/CruiseUsageSection';
import {GoalSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/GoalSection';
import {ResearchTeamsSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/ResearchTeamsSection';
import {CruiseDetailsSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/CruiseDetailsSection';
import {CruisePlanSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/CruisePlanSection';
import {EquipementSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/EquipmentSection';
import {ShipEquipmentSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/ShipEquipmentSection';
import {CruiseApplicationContext} from '@contexts/CruiseApplicationContext';
import cruiseApplicationFromLocation from '@hooks/cruiseApplicationFromLocation';
import {PermissionsSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/PermissionsSection';
import {ContractSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/ContractSection';
import {TasksSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/TasksSection';
import {ResearchAreaSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/ResearchAreaSection';
import {SpubTasksSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/SpubTasksSection';
import {PublicationsSection} from '@app/pages/FormPage/Forms/FormB/FormBSections/PublicationsSection';
import {CruiseContext} from '@contexts/CruiseContext';
import {Cruise} from 'Cruise';
import {getCruiseForCruiseApplication} from '@api/requests';
import {EmptyFunction} from '@consts/EmptyFunction';

const FormBSections = () => [
    CruiseInfoSection(),
    CruiseManagersSection(),
    CruiseUsageSection(),
    PermissionsSection(),
    ResearchAreaSection(),
    GoalSection(),
    TasksSection(),
    ContractSection(),
    ResearchTeamsSection(),
    PublicationsSection(),
    SpubTasksSection(),
    CruiseDetailsSection(),
    CruisePlanSection(),
    EquipementSection(),
    ShipEquipmentSection(),
];

function FormB() {
    const sections = FormBSections();

    const [cruise, setCruise] = useState<Cruise | undefined>(undefined);

    const cruiseApplication = cruiseApplicationFromLocation();
    useEffect(() => {
        if (cruiseApplication?.id && !cruise) {
            getCruiseForCruiseApplication(cruiseApplication.id).then((response) =>
                response ? setCruise(response?.data) : EmptyFunction);
        }
    }, [cruiseApplication]);

    return (
        <CruiseApplicationContext.Provider value={cruiseApplication}>
            <CruiseContext.Provider value={cruise}>
                <FormTemplate sections={sections} type="B" />
            </CruiseContext.Provider>
        </CruiseApplicationContext.Provider>
    );
}


export default FormB;