import DatePicker, {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import {FieldValues, useWatch} from 'react-hook-form';
import {useContext} from 'react';
import FieldWrapper from './FieldWrapper';
import {FieldProps} from './FormRadio';
import {datePickerCommon} from './DatePickerCommon';
import {FormContext} from '@contexts/FormContext';
import {pl} from 'date-fns/locale';
import {dateFormat, localeCode} from "@consts/cultureConstants";

registerLocale('pl', pl);


type StartDateFieldProps = FieldProps & {
    EndDateFieldName: string
}

type EndDateFieldProps = FieldProps & {
    StartDateFieldName: string
}

export function StartDateField(props: StartDateFieldProps) {

    const formContext = useContext(FormContext);
    const endDateValue = useWatch({
        control: formContext!.control,
        name: props.EndDateFieldName,
    });

    const render = ({ field }: FieldValues) => {
        return (
            <DatePicker
                className={'field-common w-100'}
                disabled={formContext!.readOnly ?? false}
                onChange={(e: Date | null) => {
                    if (e != null) {
                        field.onChange(e.toISOString());
                        field.onBlur();
                    }
                }}
                showTimeSelect
                {...datePickerCommon}
                endDate={endDateValue ? new Date(endDateValue) : undefined}
                startDate={field.value ? new Date(field.value as string) : undefined}
                maxDate={endDateValue ? new Date(endDateValue) : undefined}
                selectsStart
                value={field.value ? new Date(field.value).toLocaleDateString(localeCode, dateFormat) : undefined}
                selected={field.value ? new Date(field.value) : undefined}
                //dateFormat="Pp"
            />
        );
    };

    const fieldProps = {
        ...props,
        rules: { required: 'Data nie może być pusta' },
        render: render,
    };

    return (<FieldWrapper {...fieldProps} />);
}

export function EndDateField(props: EndDateFieldProps) {

    const formContext = useContext(FormContext);
    const startDateValue = useWatch({
        control: formContext!.control,
        name: props.StartDateFieldName,
    });

    const render = ({ field }: FieldValues) => {

        return (
            <DatePicker
                //  {...field}
                className={'field-common w-100'}
                disabled={formContext!.readOnly ?? false}
                onChange={(e: Date | null) => {
                    if (e != null) {
                        field.onChange(e.toISOString());
                        field.onBlur();
                    }
                }}
                {...datePickerCommon}
                startDate={startDateValue ? new Date(startDateValue) : undefined}
                endDate={field.value ? new Date(field.value) : undefined}
                minDate={startDateValue ? new Date(startDateValue) : undefined}
                selectsEnd
                showTimeSelect
                value={field.value ? new Date(field.value).toLocaleDateString('pl-PL', {
                    hour: '2-digit',
                    minute: '2-digit',
                }) : undefined}
                selected={field.value ? new Date(field.value) : undefined}
                dateFormat="Pp"
            />
        );
    };

    const fieldProps = {
        ...props,
        rules: { required: 'Data nie może być pusta' },
        render: render,
    };

    return (<FieldWrapper {...fieldProps} />);
}



