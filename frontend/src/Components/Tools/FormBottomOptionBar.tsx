import {DownloadButtonDefault, SaveMenu} from "./SaveMenu";
import React, {useContext} from "react";
import {FormContext} from "../Pages/FormPage/Wrappers/FormTemplate";
import {handlePrint, handleSubmit} from "./FormButtonsHandlers";

const SendButton = () => {
    const formContext = useContext(FormContext)
    const onClickAction = formContext!.handleSubmit(()=>null)
    return ( <button onClick={onClickAction} className="form-page-option-button-default"> Wyślij </button> )
}

const PrintButton = () => ( <button onClick={handlePrint} className="form-page-option-button-default"> Drukuj </button> )


export const BottomOptionBar = () => {
    const formContext = useContext(FormContext)
    const saveMenu = SaveMenu()

    const EditableFormButtons = () => (
        <>
            <saveMenu.saveButton/>
            <SendButton/>
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
        {!saveMenu.enabled && <DefaultMenu/>}
        {saveMenu.enabled && <saveMenu.menu/>}
    </div>)
}