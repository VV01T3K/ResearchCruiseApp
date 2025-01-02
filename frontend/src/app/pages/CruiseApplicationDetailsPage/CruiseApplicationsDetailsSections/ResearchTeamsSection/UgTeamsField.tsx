import {useContext} from 'react';
import {FormContext} from '@contexts/FormContext';
import EvaluatedUgTeamsTable from '../../../FormPage/Inputs/UgTeamsTable/EvaluatedUgTeamsTable';
import {CruiseApplicationDetailsFormInitValues} from 'CruiseApplicationDetailsFormInitValues';

export const UgTeamsField = () => {
    const formContext = useContext(FormContext);
    return (
        <EvaluatedUgTeamsTable
            className="two-fields-beside-md"
            fieldLabel="Uczestnictwo osób z jednostek organizacyjnych UG"
            ugTeams={(formContext!.initValues as CruiseApplicationDetailsFormInitValues)?.ugTeams}
        />
    );
};