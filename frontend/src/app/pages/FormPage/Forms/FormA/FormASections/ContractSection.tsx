import {ContractsField} from './ContractSectionFields';
import {SectionWrapper} from '@components/Form/Section/SectionWrapper';

export const contractSectionFieldNames = {
    contracts: 'contracts',
};

export const ContractSection = () =>
    SectionWrapper(
        {
            shortTitle: 'Umowy',
            longTitle: 'Umowy regulujące współpracę, w ramach której miałyby być realizowane zadania badawcze',
            sectionFieldNames: contractSectionFieldNames,
            children: <ContractsField />,
        },
    );

