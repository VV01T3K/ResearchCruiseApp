import React from 'react';
import { FormWrapper } from '../FormsMisc';
import { FormType } from '../../../../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation';
import { FormCSections } from './FormCSections';

const FormC = () => <FormWrapper sections={FormCSections} type={FormType.C} />;

export default FormC;