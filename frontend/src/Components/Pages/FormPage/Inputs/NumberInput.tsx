import React, {useContext} from "react";
import FieldWrapper from "./FieldWrapper";
import {FormContext, FormValue, FormValues} from "../Wrappers/FormTemplate";
import {readyFieldOptions} from "../Wrappers/ReactSelectWrapper";
import {FieldValues} from "react-hook-form";


type Props = {
    className?: string,
    fieldLabel: string,
    fieldName: string,
    maxVal: number,
    setterFunction?: (arg: number) => number,
    fieldNameToAlsoSet?: string,
    notZero?: boolean,
}

const re = /^[0-9\b]+$/;
const textIsIntNumber = (text:string) => re.test(text)

function NumberInput(props: Props){
    const formContext = useContext(FormContext)

    const ConvertNumberToString = (value:number) => {
        if(value%1)
            return value.toFixed(2)
        return value.toFixed(0)
    }
    const render = ({ field }: FieldValues) => (
            <input className="field-common"
                   {...field}
                   disabled={formContext!.readOnly ?? false}
                   onBlur={
                       (e) => {
                           if (textIsIntNumber(e.target.value)) {
                               const value = parseInt(e.target.value)
                               formContext!.setValue(
                                   props.fieldName, value > props.maxVal ?
                                       props.maxVal : ConvertNumberToString(value), readyFieldOptions
                               )

                               if (props.fieldNameToAlsoSet && props.setterFunction) {
                                   formContext!.setValue(
                                       props.fieldNameToAlsoSet,
                                       props.setterFunction(parseInt(e.target.value)),
                                       readyFieldOptions
                                   )
                               }
                           }
                           else {
                               formContext!.setValue(props.fieldName, "", readyFieldOptions)
                               if (props.fieldNameToAlsoSet)
                                   formContext!.setValue(props.fieldNameToAlsoSet, "", readyFieldOptions)

                           }
                       }
                   }
                   placeholder="0"
            />
    )

    const fieldProps = {
        ...props,
        rules: {
            required: "Pole nie może być puste",
            validate: (value: FormValue) => {
                if (props.notZero)
                    return Number(value) !== 0 || 'Pole nie może mieć wartości 0.';
            }},
        render: render,
        defaultValue:""
    }

    return ( <FieldWrapper {...fieldProps}/> );
}


export default NumberInput