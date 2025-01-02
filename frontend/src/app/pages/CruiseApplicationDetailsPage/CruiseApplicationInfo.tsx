import {useContext} from 'react';
import LinkWithState from '../../../components/Navigation/LinkWithState';
import {Path} from '../../../ToBeMoved/Tools/Path';
import {CruiseApplicationNumber} from './CruiseApplicationDetailsFields/CruiseApplicationNumber';
import {CruiseApplicationDate} from './CruiseApplicationDetailsFields/CruiseApplicationDate';
import {CruiseApplicationYear} from './CruiseApplicationDetailsFields/CruiseApplicationYear';
import {CruiseApplicationCruiseManagerName} from './CruiseApplicationDetailsFields/CruiseApplicationCruiseManagerName';
import {CruiseApplicationDeputyManagerName} from './CruiseApplicationDetailsFields/CruiseApplicationDeputyManagerName';
import {CruiseApplicationStatus} from './CruiseApplicationDetailsFields/CruiseApplicationStatus';
import {CruiseApplicationPoints} from './CruiseApplicationDetailsFields/CruiseApplicationPoints';
import {cruiseApplicationHasForm} from './helpers/CruiseApplicationHasForm';
import {CruiseApplicationFormsInfoTile} from './CruiseApplicationFormsInfoTile';
import {CruiseApplicationContext} from '@contexts/CruiseApplicationContext';
import {ListModeContext} from '@contexts/ListModeContext';

// TODO: [Not important] Create generics and move to proper folder
const FormLink = (props: { formType: string }) => {
  const cruiseApplicationContext = useContext(CruiseApplicationContext);
  const listModeContext = useContext(ListModeContext);
  const disabled = cruiseApplicationHasForm(props.formType);
  return (
    <LinkWithState
      to={Path.Form}
      useWindow={listModeContext?.mode != undefined}
      state={{
        formType: props.formType,
        cruiseApplicationId: cruiseApplicationContext!.id,
        cruiseApplication: cruiseApplicationContext,
        newOnCopy: true,
        readOnly: true,
      }}
      label={'Formularz ' + props.formType}
      disabled={disabled}
    />
  );
};

export const FormALink = () => <FormLink formType={'A'} />;

export const FormCLink = () => <FormLink formType={'C'} />;

export const FormBLink = () => <FormLink formType={'B'} />;

export const CruiseApplicationInfo = () => (
  <div className='cruise-application-info'>
    <CruiseApplicationNumber />
    <CruiseApplicationDate />
    <CruiseApplicationYear />
    <CruiseApplicationCruiseManagerName />
    <CruiseApplicationDeputyManagerName />
    <CruiseApplicationFormsInfoTile />
    <CruiseApplicationStatus />
    <CruiseApplicationPoints />
  </div>
);

export default CruiseApplicationInfo;
