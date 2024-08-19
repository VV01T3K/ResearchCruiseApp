import React from "react";
import {UseFormReturn} from "react-hook-form";
import {NewUserFormValues, Role} from "./AddUserForm";
import Select from "react-select";
import UserBasedAccess from "../../../UserBasedAccess";
import ErrorCode from "../../CommonComponents/ErrorCode";


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
    const fieldOptions = {
        required: "Pole wymagane"
    }

    const getRoleOptions = (): RoleOption[] => {
        const { UserHasAdminAccess, UserHasShipownerAccess } = UserBasedAccess()
        const roleOptions: RoleOption[] = []

        if (UserHasAdminAccess() || UserHasShipownerAccess()) {
            roleOptions.push(
                {
                    label: "Kierownik",
                    value: Role.CruiseManager
                },
                {
                    label: "Gość",
                    value: Role.Guest
                }
            )
        }
        if (UserHasAdminAccess()) {
            roleOptions.push(
                {
                    label: "Administrator",
                    value: Role.Administrator
                },
                {
                    label: "Armator",
                    value: Role.Shipowner
                }
            )
        }

        return roleOptions
    }

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
                    {...props.form.register(props.name, fieldOptions)}
                    className="d-flex w-75"
                    options={getRoleOptions()}
                    placeholder={"Wybierz wartość"}
                    isDisabled={props.disabled}
                    // defaultValue={roleOptions
                    //     .filter(roleOption => roleOption.value == Role.Guest)
                    //     .at(0)
                    // }
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
                {props.form.formState.errors[props.name] &&
                    <div className="d-flex col-12 justify-content-end">
                        <ErrorCode className="w-75" code={props.form.formState.errors[props.name]?.message} />
                    </div>
                }
            </div>
    </>
    )
}