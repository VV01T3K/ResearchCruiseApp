import {useContext} from 'react';
import FieldWrapper from './FieldWrapper';
import {FieldValue, FieldValues} from 'react-hook-form';
import {textIsIntNumber} from './Misc';
import {FormContext} from '@contexts/FormContext';


type Props = {
    className?: string,
    fieldLabel: string,
    fieldName: string,
    onChange?: (arg: number) => number,
    maxVal?: number,
    setterFunction?: (arg: number) => number,
    notZero?: boolean,
    defaultValue?: string
}
export const ConvertNumberToString = (value: number) => {
    if (value % 1) {
        return value.toFixed(2);
    }
    return value.toFixed(0);
};

function NumberInput(props: Props) {
    const formContext = useContext(FormContext);
    const ParseInput = (value: string) => {
        let returnVal;
        if (textIsIntNumber(value)) {
            returnVal = parseInt(value);
            if (props.maxVal) {
                return returnVal > props.maxVal ? props.maxVal : returnVal;
            }
            return returnVal;
        } else {
            return 0;
        }
    };
    const FieldValue = () => {
        const fieldValue = formContext?.getValues(props.fieldName);
        if (!fieldValue) {
            return '';
        }
        if (props.setterFunction) {
            return ConvertNumberToString((props.setterFunction(fieldValue)));
        }
        return ConvertNumberToString(parseFloat(fieldValue));
    };
    const render = ({ field }: FieldValues) => (
        <input className="field-common" inputMode="numeric"
               {...field}
               disabled={formContext!.readOnly ?? false}
               value={FieldValue()}
               onChange={
                   (e) => {
                       let value = ParseInput(e.target.value);
                       value = props.onChange ? props.onChange(value) : value;
                       field.onChange(String(value));
                   }
               }
               placeholder="0"
        />
    );

    const fieldProps = {
        ...props,
        rules: {
            required: 'Pole nie może być puste',
            validate: (value: FieldValue<any>) => {
                if (props.notZero) {
                    return parseFloat(value) !== 0 || 'Pole nie może mieć wartości 0.';
                }
            },
        },
        render: render,
        defaultValue: props.defaultValue ?? '0',
    };

    return (<FieldWrapper {...fieldProps} />);
}


export default NumberInput;