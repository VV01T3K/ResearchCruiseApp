import {Controller} from "react-hook-form";
import React from "react";
import InputWrapper from "./InputWrapper";
import {unregister} from "../../../serviceWorkerRegistration";
import {prop} from "react-data-table-component/dist/DataTable/util";


type Props = {
    className?: string,
    label: string,
    name: string,
    maxVal: number,
    newVal?: (arg0: number) => any,
    connectedName?: string,
    form?: any,
    notZero?: boolean
}


function NumberInput(props: Props){
    const re = /^[0-9\b]+$/;
    const onChange = (e: { target: { value: string; }; }) => {
        if (re.test(e.target.value)) {
            props.form!.setValue(
                props.name,
                String(parseInt(e.target.value) > props.maxVal ? props.maxVal : parseInt(e.target.value)),
                { shouldDirty: true, shouldValidate: true, shouldTouch:true }
            )
        }
        else //if(e.target.value=='')
            props.form!.setValue(props.name, "0", { shouldDirty: true, shouldValidate: true, shouldTouch:true })
    }

    return (
        <InputWrapper {...props}>
            <Controller
                render={({ field}) =>
                    <input className="text-center placeholder-glow"
                           value={field.value}
                           onBlur={
                        (e) => {
                               if (re.test(e.target.value)) {
                                   props.form!.setValue(
                                       props.name,
                                       String(parseInt(e.target.value)),
                                       {shouldDirty: true, shouldValidate: true, shouldTouch: true}
                                   )

                                   if (props.connectedName && props.newVal) {
                                       props.form!.setValue(
                                           props.connectedName,
                                           String(props.newVal(parseInt(e.target.value))),
                                           {shouldDirty: true, shouldValidate: true, shouldTouch: true}
                                       )
                                   }
                               }
                               else {
                                   if (props.connectedName && props.newVal)
                                       props.connectedName,
                                           "",
                                           {shouldDirty: true, shouldValidate: true, shouldTouch: true}
                               }
                               field.onBlur()
                           }
                    }
                           placeholder="0"
                           onChange={(e) => { onChange(e) }}
                    />
                }
                defaultValue={""}
                name={props.name}
                control={props.form!.control}
                rules={{
                    required: "Pole nie może być puste",
                    validate: (value) => {
                        if (props.notZero)
                            return Number(value) !== 0 || 'Pole nie może mieć wartości 0.';

                        return undefined;
                    }
                }}
            />
        </InputWrapper>
    )
}


export default NumberInput