import {SectionWrapper} from "@components/Form/Section/SectionWrapper";
import {effectsSectionFieldNames} from "@app/pages/FormPage/Forms/FormC/FormCSections/EffectsSection";
import {
    EffectsPointsField
} from "@app/pages/CruiseApplicationDetailsPage/CruiseApplicationsDetailsSections/EffectsPointsSection/EffectsPointsField";

export const EffectsPointsSection = () => SectionWrapper(
    {
        shortTitle: 'Efekty',
        longTitle: 'Efekty osiągnięte po poprzednich rejsach',
        sectionFieldNames: effectsSectionFieldNames,
        children: <EffectsPointsField />
    }
);