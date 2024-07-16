import ErrorCode from "../../LoginPage/ErrorCode";
import React from "react";
import {UseFormReturn} from "react-hook-form";
import {NewUserFormValues} from "./AddUserForm";


type Props = {
    form: UseFormReturn<NewUserFormValues>,
    label: string,
    name: "role" | "email" | "password" | "firstName" | "lastName",
    inputType?: string,
    validationPattern?: RegExp,
    validationPatternMessage?: string,
    disabled: boolean
}


export default function TextInput(props: Props) {
    return (
        <>
            <div className="d-flex flex-wrap w-100 align-items-center mb-1">
                <label
                    className="d-flex col-12 w-25 align-items-center"
                    style={{fontSize: "inherit"}}
                >
                    {props.label}:
                </label>
                <input
                    className="d-flex col-12 w-75 form-control"
                    type={props.inputType ?? "text"}
                    style={{fontSize: "inherit"}}
                    disabled={props.disabled}
                    {...props.form.register(
                        props.name,
                        {
                            required: "Pole wymagane",
                            maxLength: 30,
                            pattern: props.validationPattern && {
                                value: props.validationPattern,
                                message: props.validationPatternMessage ?? ""
                            }
                        }
                    )}
                />
                {props.form.formState.errors[props.name] &&
                    <div className="d-flex col-12 justify-content-end">
                        <ErrorCode className="w-75" code={props.form.formState.errors[props.name]?.message} />
                    </div>
                }
            </div>
    </>
    )
}