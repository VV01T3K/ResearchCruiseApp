import TextArea from '../../../Inputs/TextArea';
import {SectionWrapper} from '@components/Form/Section/SectionWrapper';
import {emailPattern} from '@consts/emailPatterns';

export const supervisorSectionFieldNames = {
    supervisor: 'supervisorEmail',
};

const SupervisorEmailField = () => (
    <TextArea
        className={'two-fields-beside-md'}
        fieldLabel={'Adres e-mail'}
        fieldName={supervisorSectionFieldNames.supervisor}
        placeholder={'Wpisz adres e-mail'}
        required={true}
        pattern={emailPattern}
    />
);

export const SupervisorSection = () => SectionWrapper(
    {
        shortTitle: 'Przełożony',
        longTitle: 'Dane kontaktowe przełożonego',
        sectionFieldNames: supervisorSectionFieldNames,
        children:
            <>
                <div className={"d-"}>
                    Użytkownik odpowiada za podanie prawidłowego adresu e-mail przełożonego, a w przypadku falszywych danych zgłoszenie może zostać odrzucone.
                </div>
                <SupervisorEmailField />
            </>,
    },
);