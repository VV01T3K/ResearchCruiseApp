import React, {useContext, useState} from "react";
import {FormContext} from "../Pages/FormPage/Wrappers/FormTemplate";
import Api from "./Api";
import {useLocation, useNavigate} from "react-router-dom";
import {Path} from "./Path";
import BusyEvent from "../CommonComponents/BusyEvent";
import {extendedUseLocation} from "../Pages/FormPage/FormPage";
import UserBasedAccess from "../UserBasedAccess";
import {Simulate} from "react-dom/test-utils";
import toggle = Simulate.toggle;
import {EmptyFunction} from "../Pages/FormPage/Forms/FormA/FormASections/CruiseManagerSectionFields";
export const SaveButton = () => {
    const formContext = useContext(FormContext)
    const locationState = extendedUseLocation()?.state
    const navigate = useNavigate()
    const handleAddCruise = () => //console.log(formContext?.getValues())
        Api
        .post(
            `/api/Cruises`,
            formContext!.getValues()
        )
        .then(_ =>
            navigate(Path.Cruises)
        )

    const handleEditCruise = () => {
        if(locationState?.cruise)
            Api.patch(
                `/api/Cruises/${locationState.cruise!.id}`,
                formContext!.getValues())
                .then(_ =>
                    navigate(Path.Cruises)
                )
    }

    return(
        <div onClick={formContext?.handleSubmit(locationState?.cruise ? handleEditCruise: handleAddCruise)} className="form-page-option-button w-100"> Zapisz rejs </div>
    )
}
export const ClearFormButton = () => {


    const formContext = useContext(FormContext)
    const locationState = extendedUseLocation()?.state

    const resetEditCruiseForm = () => formContext!.reset()

    return(
        <div onClick={ resetEditCruiseForm } className="form-page-option-button w-100"> {locationState?.cruise ? "Cofnij zmiany" : "Wyczyść formularz"} </div>
    )
}

export const ConfirmCruiseButton = () => {
    const [toggleConfirm, setToggleConfirm] = useState(false)
    const formContext = useContext(FormContext)
    const Render = () =>
        <>
            {toggleConfirm &&

                <div className={"d-flex flex-column w-100"}>
                    <div className={"w-100 text-danger text-center mt-1"}>Uwaga! Po zatwierdzeniu rejsu nie będzie możliwości
                        edycji!
                    </div>
                    <div className={"d-flex flex-row w-100"}>
                        <div  onClick={() => {
                            setToggleConfirm(!toggleConfirm);
                            formContext?.setReadOnly(!toggleConfirm)
                        }} className="form-page-option-button w-50"> Anuluj</div>
                        <div onClick={EmptyFunction} className="form-page-option-button w-50 bg-danger"> Potwierdź
                        </div>
                    </div>
                </div>
            }
            {!toggleConfirm &&
                <>
                    <div onClick={() => {
                        setToggleConfirm(!toggleConfirm);
                        formContext?.setReadOnly(!toggleConfirm)
                    }}
                         className="form-page-option-button w-100"> Zatwierdź rejs
                    </div>
                </>
            }
        </>

    return {toggleConfirm, Render}
}


export const BottomOptionBar = () => {
    const {UserHasShipownerAccess, UserHasAdminAccess} = UserBasedAccess()
    const {toggleConfirm, Render} = ConfirmCruiseButton()
    return(
        <>
            {(UserHasShipownerAccess() || UserHasAdminAccess()) &&
                <div className="form-page-option-bar">
                    {!toggleConfirm &&
                        <>
                            <ClearFormButton/>
                            <SaveButton/>
                        </>
                    }
                    <Render/>


                </div>
            }
        </>)
}