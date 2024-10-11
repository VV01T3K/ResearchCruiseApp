import React from 'react';
import { UseFormReturn } from 'react-hook-form';

import {
    ErrorMessageIfPresentNoContext,
} from '@components/Form/ErrorMessage/ErrorMessageIfPresentNoContext';
import { NewUserFormValues } from '../../../../types/NewUserFormValues';

type Props = {
    form: UseFormReturn<NewUserFormValues>;
    label: string;
    name: NewUserFormValues[keyof NewUserFormValues];
    inputType?: string;
    validationPattern?: RegExp;
    validationPatternMessage?: string;
    disabled: boolean;
};

export default function TextInput(props: Props) {
    const fieldOptions = {
        required: 'Pole wymagane',
        maxLength: { value: 256, message: 'Wprowadź maksymalnie 256 znaków' },
        pattern: props.validationPattern && {
            value: props.validationPattern,
            message: props.validationPatternMessage ?? '',
        },
    };

    return (
        <>
            <div className="d-flex flex-wrap col-md-3 col-12  mb-1">
                <label className="d-flex p-2" style={{ fontSize: 'inherit' }}>
                    {props.label}:
                </label>
                <input
                    className="d-flex w-100 field-common"
                    type={props.inputType ?? 'text'}
                    disabled={props.disabled}
                    {...props.form.register(props.name, fieldOptions)}
                />
                {props.form?.formState?.errors[props.name] && (
                    <div className="d-flex col-12 justify-content-center">
                        <ErrorMessageIfPresentNoContext
                            message={
                                props.form.formState.errors[props.name].message as string
                            }
                        />
                    </div>
                )}
            </div>
        </>
    );
}
