import {useContext} from 'react';
import {FormContext} from '@contexts/FormContext';
import {CruiseApplicationDetailsFormInitValues} from 'CruiseApplicationDetailsFormInitValues';
import ReadOnlyTextInput from '../../../../../ToBeMoved/CommonComponents/ReadOnlyTextInput';
import {FieldLabel} from '@app/pages/FormPage/Inputs/FieldWrapper';
import {CruiseApplicationContext} from '@contexts/CruiseApplicationContext';
import {CruiseApplicationStatus} from 'CruiseApplicationStatus';

export const EffectsPointsField = () => {
  const formContext = useContext(FormContext);
  const effectsPoints = (
    formContext!.initValues as CruiseApplicationDetailsFormInitValues
  )?.effectsPoints;
  const cruiseApplication = useContext(CruiseApplicationContext);
  return (
    <div>
      {cruiseApplication?.status != CruiseApplicationStatus.Draft && (
        <>
          <FieldLabel
            fieldLabel='Liczba punktów przyznanych za zrealizowane efekty rejsów zgłoszone do momentu
                                    wysłania Formularza A:'
          />
          <ReadOnlyTextInput className='d-flex mx-auto' value={effectsPoints} />
        </>
      )}
      {cruiseApplication?.status == CruiseApplicationStatus.Draft &&
        'Liczba punktów przyznanych za zrealizowane efekty rejsów zostanie przyznana dopiero po wysłaniu Formularza A'}
    </div>
  );
};
