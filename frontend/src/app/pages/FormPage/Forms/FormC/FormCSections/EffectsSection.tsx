import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import {EffectsTable} from "@app/pages/FormPage/Inputs/EffectsTable/EffectsTable";

export const effectsSectionFieldNames = {
    effects: 'effects',
};

export const EffectsSection = () => SectionWrapper(
    {
        shortTitle: 'Efekty',
        longTitle: 'Efekty rejsu',
        sectionFieldNames: effectsSectionFieldNames,
        children: <EffectsTable className="single-field"
                              fieldLabel=""
                              fieldName={effectsSectionFieldNames.effects}
        />
    },
);