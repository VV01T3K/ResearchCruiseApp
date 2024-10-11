import { UseFormReturn } from 'react-hook-form';
import { FormSectionType } from './Form/Section/FormSectionType';

import { FormAInitValues } from '@types/FormAInitValues';
import { FormBInitValues } from '@types/FormBInitValues';
import { FormCInitValues } from '@types/FormCInitValues';
import { CruiseApplicationDetailsFormInitValues } from '@types/CruiseApplicationDetailsFormInitValues';
import { CruiseFormInitValues } from '@types/CruiseFormInitValues';

export type ExtendedUseFormReturn = UseFormReturn & {
    type: string;
    readOnly?: boolean;
    setReadOnly: (state: boolean) => void;
    sections: FormSectionType[];
    initValues?: FormAInitValues | FormBInitValues | FormCInitValues | CruiseApplicationDetailsFormInitValues | CruiseFormInitValues;
};
