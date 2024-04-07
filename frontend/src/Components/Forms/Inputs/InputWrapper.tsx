import ErrorCode from "../../LoginPage/ErrorCode";
import React from "react";


type Props = any


function InputWrapper(props: Props) {
    return (
        <div className={props.className + "  d-flex flex-column p-3"}>
            <label>{props.label}</label>
            {props.children}
            {props.form.formState.errors[props.name] &&
                <ErrorCode code={props.form.formState.errors[props.name].message} />
            }
        </div>
    )
}


export default InputWrapper