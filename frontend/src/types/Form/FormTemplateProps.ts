import React from 'react';
import { FormSectionType } from './Section/FormSectionType';
import { FormAInitValues } from '@types/FormAInitValues';
import { FormBInitValues } from '@types/FormBInitValues';
import { CruiseFormInitValues } from '@types/CruiseFormInitValues';
import { CruiseApplicationDetailsFormInitValues } from '@types/CruiseApplicationDetailsFormInitValues';

export type FormTemplateProps = {
    type: string;
    readOnly?: boolean;
    sections: FormSectionType[];
    initValues?: FormAInitValues | FormBInitValues | CruiseFormInitValues | CruiseApplicationDetailsFormInitValues;
    defaultValues?: any;
    BottomOptionBar?: React.JSXElementConstructor<any>;
};
