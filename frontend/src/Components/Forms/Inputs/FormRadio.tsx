import {
    Control,
    Controller,
    FieldError,
    FieldErrorsImpl,
    FieldValues,
    Merge,
} from "react-hook-form";
import React from "react";
import ErrorCode from "../../LoginPage/ErrorCode";

function FormRadio(props: {
    className?: string,
    label: string,
    name: string,
    setValue,
    control: Control<FieldValues, any>,
    options: (string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined)[],
    errors: { [x: string]: { message: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined; }; }}){


    // const RadioButtons = ({ name }) => {
    //     const {
    //         field: { onChange, value },
    //     } = useController({
    //         name,
    //         control,
    //         defaultValue: options[0], // Ustaw domyślną wartość, jeśli to konieczne
    //     });
    //
    //     return (
    //         <div>
    //             {options.map((option, index) => (
    //                 <label key={index}>
    //                     <input
    //                         type="radio"
    //                         value={option}
    //                         onChange={onChange}
    //                         checked={value === option}
    //                     />
    //                     {option}
    //                 </label>
    //             ))}
    //         </div>
    //     );
    // };
    //


    return (
        <div className={props.className + "  p-3"}>
            <label>{props.label}</label>
            <Controller
                name={props.name}
                control={props.control}
                render={({ field }) => (
                    <div className={"d-flex flex-column"}>
                        {props.options.map((option: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | null | undefined, index: React.Key | null | undefined)=> (
                           <label key={index}>
                                <input
                                    type="radio"
                                    value={option}
                                    onChange={field.onChange}
                                    checked={field.value === option}
                                />
                               {option}
                            </label>))
                        }
                    </div>)}
            />
            {props.errors[props.name] && <ErrorCode code={props.errors[props.name].message}/>}
        </div>
    )
}

export default FormRadio