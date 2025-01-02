import {useContext, useEffect} from 'react';
import FieldWrapper from './FieldWrapper';
import {readyFieldOptions, SelectSingleValue, SelectWrapper} from '../Wrappers/ReactSelectWrapper';
import {FieldValues} from 'react-hook-form';
import {FormContext} from '@contexts/FormContext';

export type FormField = {
    className?: string,
    fieldName: string,
    fieldLabel: string,
}

type Props = FormField & {
    initValues?: string[]
}

function FormYearSelect(props: Props) {

    const formContext = useContext(FormContext);

    const setFirstAvailableYear = () => formContext!.setValue(
        props.fieldName,
        props.initValues![0],
        readyFieldOptions,
    );

    useEffect(() => {
        if (props.initValues && !formContext!.getValues(props.fieldName)) {
            setFirstAvailableYear();
        }
    }, []);


    const optionsMapper: SelectSingleValue[] | undefined = props.initValues?.map(value => ({
        value: value,
        label: value,
    }));

    const render = ({ field }: FieldValues) => {
        const currentValue = field.value ? { label: field.value, value: field.value } : undefined;

        return (
            <SelectWrapper fieldName={props.fieldName} value={currentValue} options={optionsMapper} />
        );
    };

    const fieldProps = {
        ...props,
        rules: { required: 'Wybierz jedną z opcji' },
        render: render,
    };

    return (<FieldWrapper {...fieldProps} />);
}


export default FormYearSelect;