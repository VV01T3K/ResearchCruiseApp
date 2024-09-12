import {DownloadButtonDefault, SaveMenu} from "./SaveMenu";
import React, {useContext, useState} from "react";
import {FormContext} from "../Pages/FormPage/Wrappers/FormTemplate";
import {handlePrint, handleSave, handleSubmit} from "./FormButtonsHandlers";
import Api from "./Api";
import {ReactComponent as CancelIcon}  from "/node_modules/bootstrap-icons/icons/x-lg.svg";



const SendMenu = () => {
    const [enabled, setEnabled] = useState(false)
    const formContext = useContext(FormContext)
    const Button = () => {
        const onClickAction = () => {
            formContext!.setReadOnly(true)
            setEnabled(true)
        }
        return (
            <button onClick={formContext?.handleSubmit(onClickAction)} className="form-page-option-button-default"> Wyślij </button>
        )
    }

    const CancelButton = () => (
        <div className={"form-page-option-note-button-small"} onClick={() => {
            setEnabled(false)
            formContext!.setReadOnly(false)
        }
        }>
            <CancelIcon/>
        </div>
    )

    const Points = () => (
        <div className="text-primary pt-2 text-center"> Obliczona liczba punktów: 5 </div>
    )
    const ConfirmSendButton = () => {
        const formContext = useContext(FormContext)
        const handleSubmit = () => Api.post("/api/CruiseApplications/", formContext?.getValues())
        const onClickAction = formContext!.handleSubmit(handleSubmit)
        return (
            <button onClick={handleSubmit} className="form-page-option-button w-100"> Potwierdź </button>
        )
    }

    return {
        Menu:()=>(
            <div className={"d-flex flex-column w-100"}>
                <Points/>
                <div className={"d-flex flex-row w-100"}>
                    <ConfirmSendButton/>
                    <CancelButton/>
                </div>
            </div>
        ),
        Button: Button,
        enabled:enabled

    }
}

const PrintButton = () => ( <button onClick={handlePrint} className="form-page-option-button-default"> Drukuj </button> )


export const BottomOptionBar = () => {
    const formContext = useContext(FormContext)
    const saveMenu = SaveMenu()
    const sendMenu = SendMenu()


    const EditableFormButtons = () => (
        <>
            {!sendMenu.enabled && <saveMenu.saveButton/>}
            {!saveMenu.enabled && <sendMenu.Button/>}
        </>
    )

    const ReadonlyFormButtons = () => (
        <>
            <PrintButton/>
            <DownloadButtonDefault/>
        </>
    )

    const DefaultMenu = () => (
        <>
            {!formContext!.readOnly && <EditableFormButtons/> }
            {formContext!.readOnly && <ReadonlyFormButtons/> }
        </>

    )
    return(
    <div className="form-page-option-bar">
        {!saveMenu.enabled && !sendMenu.enabled && <DefaultMenu/>}
        {saveMenu.enabled && <saveMenu.menu/>}
        {sendMenu.enabled && <sendMenu.Menu/>}
    </div>)
}