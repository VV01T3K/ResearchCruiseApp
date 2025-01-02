import {UseFormReturn} from 'react-hook-form';
import {FormSectionType} from 'Form/Section/FormSectionType';
import {FormInitValues} from 'FormInitValues';

export type ExtendedUseFormReturn = UseFormReturn & {
    type: string;
    readOnly?: boolean;
    setReadOnly: (state: boolean) => void;
    sections: FormSectionType[];
    initValues?: FormInitValues;
};
