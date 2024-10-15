import { FieldValues } from 'react-hook-form';
import React, { useContext } from 'react';
import FieldWrapper from './FieldWrapper';
import { readyFieldOptions } from '../Wrappers/ReactSelectWrapper';
import { FormContext } from '@contexts/FormContext';
import { FieldProps } from '@app/pages/FormPage/Inputs/FormRadio';
import CustomConverter from '../../../../ToBeMoved/Tools/CustomConverter';

type Props = FieldProps & {
    defaultValue?: string
}

function BoolField(props: Props) {

    const render = ({ field }: FieldValues) => {
        console.log(field.value);
        const isTrue = CustomConverter.stringToBoolean(field.value);
        return (
            <div className={'d-flex flex-row w-100'}>
                <div onClick={() => field.onChange('true')}
                     className={
                         ' field-common col-6 m-1 ' +
                         (isTrue ? ' bg-primary text-white' : '')
                     }
                >
                    Tak
                </div>
                <div onClick={() => field.onChange('false')}
                     className={
                         'field-common col-6 m-1' +
                         (!isTrue ? ' bg-primary text-white' : '')
                     }
                >
                    Nie
                </div>
            </div>
        );
    };

    const fieldProps = {
        ...props,
        defaultValue: props.defaultValue ?? 'false',
        rules: { required: 'Wybierz jedną z opcji' },
        render: render,
    };

    return (<FieldWrapper {...fieldProps} />);
}


export default BoolField;