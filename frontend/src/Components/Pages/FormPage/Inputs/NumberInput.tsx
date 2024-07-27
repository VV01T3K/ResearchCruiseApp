import {Controller, UseFormReturn} from "react-hook-form";
import React from "react";
import InputWrapper from "./InputWrapper";
import {FormValue, FormValues} from "../Wrappers/FormTemplate";
import {FormAValue} from "../Forms/FormA";


type Props = {
    className?: string,
    label: string,
    name: keyof FormValues,
    maxVal: number,
    newVal?: (arg0: number) => any,
    connectedName?: keyof FormValues,
    form?: UseFormReturn<FormValues>,
    notZero?: boolean,
    readonly?: boolean,
    fractionDigits?: number
}


function NumberInput(props: Props){
    const re = /^[0-9\b]+$/;
    const onChange = (e: { target: { value: string; }; }) => {
        if (re.test(e.target.value)) {
            props.form!.setValue(
                props.name,
                parseInt(e.target.value) > props.maxVal ? props.maxVal : parseInt(e.target.value),
                { shouldDirty: true, shouldValidate: true, shouldTouch:true }
            )
        }
        else //if (e.target.value == '')
            props.form!.setValue(
                props.name,
                0,
                { shouldDirty: true, shouldValidate: true, shouldTouch:true }
            )
    }

    return (
        <InputWrapper {...props}>
            <Controller
                render={({ field}) =>
                    <input className="text-center placeholder-glow"
                           disabled={props.readonly ?? false}
                           value={(field.value as number)?.toFixed(props.fractionDigits ?? 0) ?? ""}
                           onBlur={
                        (e) => {
                               if (re.test(e.target.value)) {
                                   props.form!.setValue(
                                       props.name,
                                       parseInt(e.target.value),
                                       {shouldDirty: true, shouldValidate: true, shouldTouch: true}
                                   )

                                   if (props.connectedName && props.newVal) {
                                       props.form!.setValue(
                                           props.connectedName,
                                           props.newVal(parseInt(e.target.value)),
                                           {shouldDirty: true, shouldValidate: true, shouldTouch: true}
                                       )
                                   }
                               }
                               // else {
                               //     if (props.connectedName && props.newVal)
                               //         props.connectedName,
                               //             "",
                               //             {shouldDirty: true, shouldValidate: true, shouldTouch: true}
                               // }
                               field.onBlur()
                           }
                    }
                           placeholder="0"
                           onChange={(e) => { onChange(e) }}
                    />
                }
                //defaultValue={undefined}
                name={props.name}
                control={props.form!.control}
                rules={{
                    required: "Pole nie może być puste",
                    validate: (value: FormValue) => {
                        if (props.notZero)
                            return Number(value) !== 0 || 'Pole nie może mieć wartości 0.';
                    }
                }}
            />
        </InputWrapper>
    )
}


export default NumberInput