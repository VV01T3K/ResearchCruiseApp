import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import {ContractsField} from './ContractsField';
import {contractSectionFieldNames} from './ContractSectionFieldNames';


export const ContractSection = () => SectionWrapper(
    {
        shortTitle: 'Umowy',
        longTitle: 'Umowy regulujące współpracę w ramach której miałyby być realizowane zadania badawcze',
        sectionFieldNames: contractSectionFieldNames,
        children: <ContractsField />,
    },
);
