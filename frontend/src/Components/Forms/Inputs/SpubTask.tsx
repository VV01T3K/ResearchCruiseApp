import React from "react";
import {Control, Controller, FieldValues} from "react-hook-form";


type Props = {
    className?: string,
    label: string,
    name: string,
    control: Control<FieldValues, any> | undefined,
    watch?,
    setValue?,
    resetField?
}


const SpubTask = (props: Props) => {
    return (
        <div className={props.className + " p-3"}>
            <label>{props.label}</label>
            <div className="justify-content-center align-self-center d-flex flex-column w-100">
                <Controller
                    name={props.name}
                    control={props.control}
                    render={({ field}) => (
                        <>
                            <input type="text" {...field} onChange={""} onHover={""} />
                        </>
                    )}
                />
            </div>
        </div>
    );
};


export default SpubTask;