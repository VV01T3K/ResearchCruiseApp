import {useForm} from "react-hook-form";
import React, {useState} from "react";
import TextInput from "./TextInput";
import RoleInput from "./RoleInput";
import Api from "../../../Tools/Api";
import {disable} from "workbox-navigation-preload";
import ErrorCode from "../../LoginPage/ErrorCode";
import errorCode from "../../LoginPage/ErrorCode";


export enum Role {
    Administrator = "Administrator",
    Shipowner = "Shipowner",
    CruiseManager = "CruiseManager",
    Guest = "Guest"
}


export type NewUserFormValues = {
    role: Role,
    email: string,
    password: string,
    firstName: string,
    lastName: string
}


export default function AddUserForm() {
    const newUserFormDefaultValues: NewUserFormValues = {
        role: Role.Guest,
        email: "",
        password: "",
        firstName: "",
        lastName: ""
    }
    const newUserForm = useForm<NewUserFormValues>({
        defaultValues: newUserFormDefaultValues
    })

    const [showDropDown, setShowDropDown] = useState(false)
    const [sending, setSending] = useState(false)
    const [sendingError, setSendingError] = useState("")

    const handleSubmit = () => {
        setSendingError("")
        setSending(true)
        Api.
            post(
                "/users",
                newUserForm.getValues()
            )
            .then(response => {
                setSending(false)
                newUserForm.reset()
            })
            .catch(error => {
                setSendingError(error.response.data)
                setSending(false)
            })
    }


    return (
        <div className="d-flex flex-wrap p-3 col-12">
            <a
                className="d-flex btn btn-info mb-2"
                style={{fontSize: "inherit"}}
                onClick={() => setShowDropDown(!showDropDown)}
            >
                Nowy użytkownik {showDropDown ? " ▲" : " ▼"}
            </a>
            {showDropDown &&
                <div className="d-flex flex-wrap w-100 p-3 border border-dark-subtle rounded-2">
                    <RoleInput
                        form={newUserForm}
                        label="Rola"
                        name="role"
                        disabled={sending}
                    />
                    <TextInput
                        form={newUserForm}
                        label="E-mail"
                        name="email"
                        // validationPattern={/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/}
                        // validationPatternMessage="Nieprawidłowy adres e-mail"
                        disabled={sending}
                    />
                    <TextInput
                        form={newUserForm}
                        label="Hasło"
                        name="password"
                        inputType="password"
                        validationPattern={/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/}
                        validationPatternMessage="Hasło musi zawierać co najmniej 8 znaków, w tym małą i wielką literę, cyfrę i znak specjalny"
                        disabled={sending}
                    />
                    <TextInput
                        form={newUserForm}
                        label="Imię"
                        name="firstName"
                        disabled={sending}
                    />
                    <TextInput
                        form={newUserForm}
                        label="Nazwisko"
                        name="lastName"
                        disabled={sending}
                    />

                    <div className="d-flex w-100 align-items-center mt-1 justify-content-start">
                        <a
                            className="btn btn-info"
                            type="submit"
                            style={{fontSize: "inherit"}}
                            onClick={newUserForm.handleSubmit(handleSubmit)}
                        >
                            Dodaj
                        </a>
                    </div>
                    {sendingError != "" &&
                        <div className="d-flex col-12 justify-content-end">
                            <ErrorCode className="w-100" code={sendingError} />
                        </div>
                    }
                </div>
            }
        </div>
    )
}