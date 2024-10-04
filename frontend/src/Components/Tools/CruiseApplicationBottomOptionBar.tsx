import React, {useContext, useState} from "react";
import {FormContext} from "../Pages/FormPage/Wrappers/FormTemplate";
import { handleSave} from "./FormButtonsHandlers";
import Api from "./Api";
import {CruiseApplicationContext} from "../Pages/CruiseApplicationDetailsPage/CruiseApplicationDetailsPage";
import {CruiseApplicationStatus} from "../Pages/CruiseApplicationsPage/CruiseApplicationsPage";

const SendButton = () => {
    const formContext = useContext(FormContext)
    const handleSubmit = () => Api.post("/api/CruiseApplications/", formContext?.getValues()).then(()=>formContext!.setReadOnly(true))
    const onClickAction = formContext!.handleSubmit(handleSubmit)
    return ( <button onClick={handleSubmit} className="form-page-option-button-default"> Zapisz punkty </button> )
}

const CancelButton = () => {
    const formContext = useContext(FormContext)
    const cancel = () => {
        formContext?.reset()
        formContext!.setReadOnly(true)
    }
    return ( <button onClick={cancel} className="form-page-option-button-default"> Anuluj </button> )
}

const EditButton = () => {
    const formContext = useContext(FormContext)
    const editPoints = () => formContext!.setReadOnly(false)

    return (<button onClick={editPoints} className="form-page-option-button-default"> Edytuj punkty </button>)
}


export const ConfirmApplicationButton = () => {
    const formContext = useContext(FormContext)
    return(
        <div onClick={()=>handleSave(formContext!)} className="form-page-option-button w-100"> Potwierdź zgłoszenie </div>
    )
}

export const CancelApplicationButton = () => {
    const formContext = useContext(FormContext)
    const [confirm, setConfirm] = useState(false)
    const Button = () => (
        <div onClick={()=>setConfirm(true)} className="form-page-option-button bg-danger w-100"> Odrzuć zgłoszenie </div>
    )
    const ConfirmMenu = () => (
        <div className={"d-flex flex-column w-100"}>
            <div className={"w-100 text-danger text-center mt-1"}>Po odrzuceniu wymagane będzie ponowne złożenie wniosku</div>
            <div className={"d-flex flex-row w-100"}>
                <div onClick={() => setConfirm(false)} className="form-page-option-button w-50"> Anuluj </div>
                <div onClick={() => {
                    setConfirm(false)
                }} className="form-page-option-button w-50 bg-danger"> Potwierdź odrzucenie </div>
            </div>
        </div>

    )
    return {
        confirm:confirm,
        Button:Button,
        ConfirmMenu: ConfirmMenu
    }
}

const AcceptedBySupervisorMenu = () => {
    const CancelApplication = CancelApplicationButton()
    return (
        <>
            {!CancelApplication.confirm && <ConfirmApplicationButton/>}
            {!CancelApplication.confirm && <CancelApplication.Button/>}
            {CancelApplication.confirm && <CancelApplication.ConfirmMenu/>}

        </>
    )
}

export const BottomOptionBar = () => {
    const formContext = useContext(FormContext)
    const EditableFormButtons = () => (
        <>
            <CancelButton/>
            <SendButton/>
        </>
    )

    const ReadonlyFormButtons = () => {
        const CancelApplication = CancelApplicationButton()
        return(
            <>
                {!CancelApplication.confirm && <EditButton/> }
                {!CancelApplication.confirm && <CancelApplication.Button/>}
                {CancelApplication.confirm && <CancelApplication.ConfirmMenu/>}
            </>
        )
    }

    const DefaultMenu = () => (
        <>
            {!formContext!.readOnly && <EditableFormButtons/> }
            {formContext!.readOnly && <ReadonlyFormButtons/> }
        </>

    )

    const applicationContext = useContext(CruiseApplicationContext)
    const WaitingForSupervisorMenu = () => {
        const CancelApplication = CancelApplicationButton()

        return (
            <>
                {!CancelApplication.confirm && <CancelApplication.Button/>}
                {CancelApplication.confirm && <CancelApplication.ConfirmMenu/>}
            </>
        )
    }


    const EditPointsMenu = () => (
        <>
            <DefaultMenu/>
        </>
    )

    const FormBRequired = () => (
        <div className="form-page-option-element w-100">
            {CruiseApplicationStatus.FormBRequired}
        </div>
    )

    const FormBFilled = () => (
        <div className="form-page-option-element w-100">
            {CruiseApplicationStatus.FormBFilled}
        </div>
    )

    const CruiseBegan = () => (
        <div className="form-page-option-element w-100">
            {CruiseApplicationStatus.CruiseBegan}
        </div>
    )

    const UnderTaken = () => (
        <div className="form-page-option-element w-100">
            {CruiseApplicationStatus.Undertaken}
        </div>
    )

    const Reported = () => (
        <div className="form-page-option-element w-100">
            {CruiseApplicationStatus.Reported}
        </div>
    )

    return(
    <div className="form-page-option-bar">
        {/*{applicationContext!.status == CruiseApplicationStatus.WaitingForSupervisor && <WaitingForSupervisorMenu/>}*/}
        {applicationContext!.status == CruiseApplicationStatus.AcceptedBySupervisor && <AcceptedBySupervisorMenu/>}
        {applicationContext!.status == CruiseApplicationStatus.WaitingForSupervisor && <EditPointsMenu/>}
        {applicationContext!.status == CruiseApplicationStatus.FormBRequired && <FormBRequired/>}
        {applicationContext!.status == CruiseApplicationStatus.FormBFilled && <FormBFilled/>}
        {applicationContext!.status == CruiseApplicationStatus.CruiseBegan && <CruiseBegan/>}
        {applicationContext!.status == CruiseApplicationStatus.Undertaken && <UnderTaken/>}
        {applicationContext!.status == CruiseApplicationStatus.Reported && <Reported/>}
    </div>
    )
}