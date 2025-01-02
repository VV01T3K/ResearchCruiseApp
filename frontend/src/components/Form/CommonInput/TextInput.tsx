import {FieldError, FieldValues, Path, UseFormReturn} from 'react-hook-form';

import {ErrorMessageIfPresentNoContext,} from '@components/Form/ErrorMessage/ErrorMessageIfPresentNoContext';

type Props<TForm extends FieldValues> = {
    form: UseFormReturn<TForm>;
    label: string;
    name: Path<TForm>;
    inputType?: string;
    validationPattern?: RegExp;
    validationPatternMessage?: string;
    disabled: boolean;
    maxLength?: number;
};

type FormError<T> = FieldError & {
    [K in keyof T]?: FieldError;
};

export default function TextInput<TForm extends FieldValues>(props: Props<TForm>) {
    const fieldOptions = {
        required: 'Pole wymagane',
        maxLength: {
            value: props.maxLength ?? 256,
            message: `Maksymalna liczba znaków to ${props.maxLength ?? 256}.`
        },
        pattern: props.validationPattern && {
            value: props.validationPattern,
            message: props.validationPatternMessage ?? '',
        },
    };

    return (
        <>
            <div className="d-flex flex-wrap col-md-3 col-12 mb-1">
                <label className="d-flex p-1" style={{ fontSize: 'inherit' }}>
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
                            message={(props.form.formState.errors[props.name] as FormError<TForm>).message}
                        />
                    </div>
                )}
            </div>
        </>
    );
}
