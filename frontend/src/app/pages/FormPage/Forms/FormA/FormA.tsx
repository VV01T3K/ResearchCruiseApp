import React from 'react';
import { FormWrapper } from '../FormsMisc';
import { formType } from '../../../../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation';
import { FormASections } from './FormASections';

const FormA = () => <FormWrapper sections={FormASections} type={formType.A} />;

export default FormA;
