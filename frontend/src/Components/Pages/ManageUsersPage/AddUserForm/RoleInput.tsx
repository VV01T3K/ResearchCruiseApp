import ErrorCode from "../../CommonComponents/ErrorCode";
import React from "react";
import {Controller, UseFormReturn} from "react-hook-form";
import {NewUserFormValues, Role} from "./AddUserForm";
import Select from "react-select";


type RoleOption = {
    label: string,
    value: Role
}

type Props = {
    form: UseFormReturn<NewUserFormValues>,
    label: string,
    name: "role" | "email" | "password" | "firstName" | "lastName",
    disabled: boolean
}


export default function RoleInput(props: Props) {
    const roleOptions: RoleOption[] = [
        {
            label: "Administrator",
            value: Role.Administrator
        },
        {
            label: "Armator",
            value: Role.Shipowner
        },
        {
            label: "Kierownik",
            value: Role.CruiseManager
        },
        {
            label: "Gość",
            value: Role.Guest
        }
    ]

    return (
        <>
            <div className="d-flex flex-wrap w-100 align-items-center mb-1">
                <label
                    className="d-flex col-12 w-25 align-items-center"
                    style={{fontSize: "inherit"}}
                >
                    {props.label}:
                </label>
                <Select
                    className="d-flex w-75"
                    options={roleOptions}
                    placeholder={"Wybierz wartość"}
                    isDisabled={props.disabled}
                    defaultValue={{
                        label: "Gość",
                        value: Role.Guest
                    }}
                    onChange={selectedValue => {
                        if (selectedValue) {
                            props.form.setValue(
                                props.name,
                                selectedValue.value,
                                {
                                    shouldTouch: true,
                                    shouldValidate: true,
                                    shouldDirty: true
                                }
                            )
                        }
                    }}
                />
            </div>
    </>
    )
}