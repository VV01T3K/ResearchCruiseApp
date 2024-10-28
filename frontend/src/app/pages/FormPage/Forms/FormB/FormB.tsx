import React from 'react';
import { FormWrapper } from '../FormsMisc';
import { FormType } from '../../../../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation';
import { FormBSections } from './FormBSections';

const FormB = () => <FormWrapper sections={FormBSections} type={FormType.B} />;

export default FormB;