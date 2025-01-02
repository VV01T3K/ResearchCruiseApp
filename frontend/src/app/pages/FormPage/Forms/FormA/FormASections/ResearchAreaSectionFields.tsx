import {useContext} from 'react';
import ResearchAreaSelect from '../../../Inputs/ResearchAreaSelect';
import TextArea from '../../../Inputs/TextArea';
import {researchAreaSectionFieldNames} from './ResearchAreaSection';
import {FormContext} from '@contexts/FormContext';
import {FormAInitValues} from 'FormAInitValues';

export const ResearchAreaField = () => {
    const formContext = useContext(FormContext);
    return (
        <ResearchAreaSelect
            className="two-fields-beside-md"
            fieldLabel="Obszar prowadzonych badań"
            fieldName={researchAreaSectionFieldNames.researchArea}
            initValues={(formContext!.initValues as FormAInitValues)?.researchAreas}
        />
    );
};
export const ResearchAreaDescriptionField = () => (
    <TextArea
        className="two-fields-beside-md"
        fieldLabel="Opis"
        placeholder={'Wpisz opis'}
        fieldName={researchAreaSectionFieldNames.researchAreaInfo}
        required={false}
    />
);
