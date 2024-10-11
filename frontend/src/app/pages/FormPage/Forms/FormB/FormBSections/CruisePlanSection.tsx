import { SectionWrapper } from '@components/Form/Section/SectionWrapper';
import DetailedPlanTable from '@app/pages/FormPage/Inputs/DetailedPlanTable/DetailedPlanTable';

export const cruisePlanSectionFieldNames = {
    detailedPlan: 'DetailedPlan',
};

export const CruisePlanSection = () => SectionWrapper(
    {
        shortTitle: 'Plan',
        longTitle: 'Szczegółowy plan zadań do realizacji podczas rejsu',
        sectionFieldNames: cruisePlanSectionFieldNames,
        children: <>
            <DetailedPlanTable
                fieldName={cruisePlanSectionFieldNames.detailedPlan}
                className={'single-field'}
                fieldLabel={'Szczegółowy plan rejsu'} />
        </>,
    },
);