import {DifferentShipUsageField, ShipUsageField} from '../../FormA/FormASections/TimeSectionFields';
import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import ReadonlyOverrideWrapper from '@components/Form/ReadonlyOverrideWrapper';

export const cruiseUsageFieldNames = {
    shipUsage: 'shipUsage',
    differentUsage: 'differentUsage',
};


export const CruiseUsageSection = () => SectionWrapper(
    {
        shortTitle: 'Wykorzystanie statku',
        longTitle: 'Sposób wykorzystania statku',
        sectionFieldNames: cruiseUsageFieldNames,
        children:
            <ReadonlyOverrideWrapper>
                <ShipUsageField />
                <DifferentShipUsageField />
            </ReadonlyOverrideWrapper>,
    },
);