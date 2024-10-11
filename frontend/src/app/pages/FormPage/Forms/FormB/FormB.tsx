import FormTemplate from '../../Wrappers/FormTemplate';
import React from 'react';
import { CruiseInfoSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/CruiseInfoSection';
import { CruiseManagersSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/CruiseManagersSection';
import { PermissionsSection } from '../FormA/FormASections/PermissionsSection';
import { ResearchAreaSection } from '../FormA/FormASections/ResearchAreaSection';
import { CruiseUsageSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/CruiseUsageSection';
import { SpubTasksSection } from '../FormA/FormASections/SpubTasksSection';
import { GoalSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/GoalSection';
import { TasksSection } from '../FormA/FormASections/TasksSection';
import { ContractSection } from '../FormA/FormASections/ContractSection';
import { ResearchTeamsSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/ResearchTeamsSection';
import { CruiseDetailsSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/CruiseDetailsSection';
import { PublicationsSection } from '../FormA/FormASections/PublicationsSection';
import { CruisePlanSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/CruisePlanSection';
import { EquipementSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/EquipmentSection';
import { TechnicalElementsSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/TechnicalElementsSection';
import { CruiseApplicationContext } from '@contexts/CruiseApplicationContext';
import cruiseApplicationFromLocation from '@hooks/cruiseApplicationFromLocation';

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
    TechnicalElementsSection(),
];

function FormB() {
    const sections = FormBSections();
    const cruiseApplication = cruiseApplicationFromLocation();
    return (
        <CruiseApplicationContext.Provider value={cruiseApplication}>
            <FormTemplate sections={sections} type="B" />
        </CruiseApplicationContext.Provider>
    );
}


export default FormB;