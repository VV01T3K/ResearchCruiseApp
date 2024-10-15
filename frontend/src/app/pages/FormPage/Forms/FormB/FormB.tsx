import FormTemplate from '../../Wrappers/FormTemplate';
import React from 'react';
import { CruiseInfoSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/CruiseInfoSection';
import { CruiseManagersSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/CruiseManagersSection';
import { CruiseUsageSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/CruiseUsageSection';
import { GoalSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/GoalSection';
import { ResearchTeamsSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/ResearchTeamsSection';
import { CruiseDetailsSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/CruiseDetailsSection';
import { CruisePlanSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/CruisePlanSection';
import { EquipementSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/EquipmentSection';
import { TechnicalElementsSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/TechnicalElementsSection';
import { CruiseApplicationContext } from '@contexts/CruiseApplicationContext';
import cruiseApplicationFromLocation from '@hooks/cruiseApplicationFromLocation';
import { PermissionsSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/PermissionsSection';
import { ContractSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/ContractSection';
import { TasksSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/TasksSection';
import { ResearchAreaSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/ResearchAreaSection';
import { SpubTasksSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/SpubTasksSection';
import { PublicationsSection } from '@app/pages/FormPage/Forms/FormB/FormBSections/PublicationsSection';

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