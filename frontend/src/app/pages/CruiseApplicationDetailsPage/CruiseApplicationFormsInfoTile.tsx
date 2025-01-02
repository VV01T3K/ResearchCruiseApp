import SimpleInfoTile from '../../../ToBeMoved/CommonComponents/SimpleInfoTile';
import {FormALink, FormBLink, FormCLink} from './CruiseApplicationInfo';

export const CruiseApplicationFormsInfoTile = () => (
    <SimpleInfoTile title="Formularze">
        <FormALink />
        <FormBLink />
        <FormCLink />
    </SimpleInfoTile>
);