import {useContext} from 'react';
import FormRadio from '../../../Inputs/FormRadio';
import TextArea from '../../../Inputs/TextArea';
import {goalSectionFieldNames} from './GoalSection';
import {FormContext} from '@contexts/FormContext';
import {FormAInitValues} from 'FormAInitValues';

export const CruiseGoalField = () => {
    const formContext = useContext(FormContext);
    return (
        <FormRadio className="two-fields-beside-md"
                   fieldLabel="Cel rejsu"
                   isVertical={true}
                   fieldName={goalSectionFieldNames.cruiseGoal}
                   initValues={(formContext!.initValues as FormAInitValues)?.cruiseGoals}
        />
    );
};
export const CruiseGoalDescriptionField = () => (
    <TextArea className="two-fields-beside-md"
              fieldLabel="Opis"
              placeholder={'Opisz cel rejsu'}
              fieldName={goalSectionFieldNames.cruiseGoalDescription}
              required="Opisz cel"
    />
);
