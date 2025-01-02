import {useContext} from 'react';
import {FormContext} from '@contexts/FormContext';
import EvaluatedGuestTeamsTable from '../../../FormPage/Inputs/GuestTeamsTable/EvaluatedGuestTeamsTable';
import {FormAInitValues} from 'FormAInitValues';

export const GuestTeamsField = () => {
    const formContext = useContext(FormContext);
    return (
        <EvaluatedGuestTeamsTable
            className="two-fields-beside-md"
            fieldLabel="Uczestnictwo gości spoza UG"
            guestTeams={(formContext!.initValues as FormAInitValues)?.guestTeams}
        />
    );
};