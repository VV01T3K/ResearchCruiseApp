import { FieldValues } from 'react-hook-form';
import React, { useContext } from 'react';
import FieldWrapper from './FieldWrapper';
import TextareaAutosize from 'react-textarea-autosize';
import { FormContext } from '@contexts/FormContext';

type Props = {
    className?: string,
    fieldLabel: string,
    fieldName: string,
    required?: any,
    maxLength?: number,
    resize?: string,
    disabled?: boolean
    placeholder?: string
    pattern?: RegExp
}

function TextArea(props: Props) {
    const formContext = useContext(FormContext);

    // const onChange = (e: { target: { value: string; }; }) => {
    //     var value = e.target.value
    //     if (props.maxLength && value.length > props.maxLength) {
    //         value = value.slice(0,props.maxLength)
    //     }
    //
    //     // formContext!.setValue(props.fieldName, value, readyFieldOptions)
    // }

    const render = ({ field }: FieldValues) => (
        <TextareaAutosize
            className={'field-common h-100'}
            {...field}
            disabled={formContext!.readOnly ?? props.disabled}
            value={field.value?.toString()}
            // onBlur={onChange}
            placeholder={props.placeholder}
        />);

    const fieldProps = {
        ...props,
        render: render,
        rules: {
            required: props.required ? 'Pole wymagane' : false,
            validate: {
                maxLength: (field: FieldValues) => {
                    const maxLength = props.maxLength ?? 200;
                    return field.length <= maxLength || `Za długi tekst, maksymalna długość to ${maxLength} znaków. (Aktualnie ${field.length})`;
                },
            },
            pattern: props.pattern
                ? {
                    value: props.pattern, // Regex dla pattern
                    message: 'Format adresu email nieprawidlowy', // Komunikat błędu dla pattern
                }
                : undefined,
        },
        defaultValue: '',

    };

    return (
        <FieldWrapper {...fieldProps} />
    );
}


export default TextArea;