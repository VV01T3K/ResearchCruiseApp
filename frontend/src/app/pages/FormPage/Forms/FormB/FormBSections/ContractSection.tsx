import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import ReadonlyOverrideWrapper from '@components/Form/ReadonlyOverrideWrapper';
import {ContractsField} from '@app/pages/FormPage/Forms/FormA/FormASections/ContractSectionFields';

export const contractSectionFieldNames = {
    contracts: 'contracts',
};

export const ContractSection = () =>
    SectionWrapper(
        {
            shortTitle: 'Umowy',
            longTitle: 'Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze',
            sectionFieldNames: contractSectionFieldNames,
            children:
                <ReadonlyOverrideWrapper>
                    <ContractsField />
                </ReadonlyOverrideWrapper>,
        },
    );

