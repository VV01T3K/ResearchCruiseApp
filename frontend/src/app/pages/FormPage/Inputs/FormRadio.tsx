import {FieldValues} from 'react-hook-form';
import {useContext} from 'react';
import FieldWrapper from './FieldWrapper';
import {readyFieldOptions} from '../Wrappers/ReactSelectWrapper';
import {FormContext} from '@contexts/FormContext';

export type FieldProps = {
    className?: string,
    fieldName: string,
    fieldLabel?: string
}
type Props = FieldProps & {
    initValues?: string[],
    isVertical?: boolean,
}


function FormRadio(props: Props) {
    const formContext = useContext(FormContext);

    const render = ({ field }: FieldValues) => {
        const fieldName = props.fieldName;
        const RadioOption = (props: { option: string, index: number }) => (
            <input key={props.index} disabled={formContext!.readOnly}
                   className={`${field.value === String(props.index) ? 'radio-button-selected ' : 'radio-button-not-selected'} w-100`}
                   type={'button'} value={props.option}
                   onClick={() => formContext!.setValue(fieldName, String(props.index), readyFieldOptions)}
            />
        );
        return (
            <div
                className={`d-flex ${props.isVertical ? 'flex-column' : 'flex-row'} justify-content-center align-content-center`}>
                {props.initValues?.map((option, index) => (
                    <RadioOption key={index} option={option} index={index} />
                ))}
            </div>
        );
    };


    const fieldProps = {
        ...props,
        rules: { required: 'Wybierz jedną z opcji' },
        render: render,
    };

    return (<FieldWrapper {...fieldProps} />);
}


export default FormRadio;