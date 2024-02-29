import {Controller,} from "react-hook-form";
import React from "react";
import InputWrapper from "./InputWrapper";

function NumberInput(props: {
    className?: string,
    label: string,
    name: string,
    maxVal: number,
    newVal: (arg0: number) => any,
    name2: string,
    form}){


    const re =  /^[0-9\b]+$/;
    const onChange = (e: { target: { value: string; }; }) => {
        if (re.test(e.target.value)) {
            props.form.setValue(props.name, String(parseInt(e.target.value) > props.maxVal ? props.maxVal: parseInt(e.target.value)), {shouldDirty:true})

            props.form.setValue(props.name, String(parseInt(e.target.value) > props.maxVal ? props.maxVal: parseInt(e.target.value)), { shouldValidate:true})
        }
        else //if(e.target.value=='')
            props.form.setValue(props.name, "0", {shouldValidate:true})
    }
    return (
        <InputWrapper {...props}>
            <Controller
                render={({ field }) => <input className={"text-center"} value={field.value}
                                              onBlur={(e)=>{
                                                  props.form.setValue(props.name2, String(props.newVal(parseInt(e.target.value))), { shouldDirty: true })
                                                  props.form.setValue(props.name2, String(props.newVal(parseInt(e.target.value))), { shouldValidate: true })
                                                  props.form.setValue(props.name, String(parseInt(e.target.value)), { shouldDirty: true })
                                                  props.form.setValue(props.name, String(parseInt(e.target.value)), { shouldValidate: true })
                        // field.onBlur();
                    }
                } onChange={(e)=>{onChange(e)}} />}
                name={props.name}
                control={props.form.control}
                rules={{
                    required:"Pole nie może być puste" ,
                    validate: (value) => Number(value) != 0 ||   'Pole nie może mieć wartości 0.'
                }
                }
            />
        </InputWrapper>
    )
}

export default NumberInput