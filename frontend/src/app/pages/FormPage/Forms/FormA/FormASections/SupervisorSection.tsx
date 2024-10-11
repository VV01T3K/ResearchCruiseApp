import React from 'react';
import TextArea from '../../../Inputs/TextArea';
import { SectionWrapper } from '@components/Form/Section/SectionWrapper';
import { emailPattern } from '@consts/emailPatterns';

export const supervisorSectionFieldNames = {
    supervisor: 'supervisorEmail',
};

const SupervisorEmailField = () => (
    <TextArea
        className={'two-fields-beside-md'}
        fieldLabel={'Adres email'}
        fieldName={supervisorSectionFieldNames.supervisor}
        placeholder={'Wpisz adres email'}
        required={true}
        pattern={emailPattern}
    />
);

export const SupervisorSection = () => SectionWrapper(
    {
        shortTitle: 'Przełożony',
        longTitle: 'Dane kontaktowe przełożonego',
        sectionFieldNames: supervisorSectionFieldNames,
        children: <SupervisorEmailField />,
    },
);