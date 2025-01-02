import React from 'react';
import {FormSectionType} from './Section/FormSectionType';
import {FormAInitValues} from 'FormAInitValues';
import {FormBInitValues} from 'FormBInitValues';
import {CruiseFormInitValues} from 'CruiseFormInitValues';
import {CruiseApplicationDetailsFormInitValues} from 'CruiseApplicationDetailsFormInitValues';
import {FormTypeKeys} from '../../ToBeMoved/Pages/CommonComponents/FormTitleWithNavigation';

export type FormTemplateProps = {
    type: FormTypeKeys;
    readOnly?: boolean;
    sections: FormSectionType[];
    initValues?: FormAInitValues | FormBInitValues | CruiseFormInitValues | CruiseApplicationDetailsFormInitValues;
    defaultValues?: any;
    BottomOptionBar?: React.JSXElementConstructor<any>;
};
