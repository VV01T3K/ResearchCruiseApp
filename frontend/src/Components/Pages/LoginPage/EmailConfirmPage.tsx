import React, {useEffect, useState} from 'react';
import Page from "../Page";
import {useNavigate} from "react-router-dom";
import ErrorMessageIfPresent, {ErrorMessageIfPresentNoContext} from "../CommonComponents/ErrorMessageIfPresent";
import useFormWrapper from "../../CommonComponents/useFormWrapper";
import userDataManager from "../../CommonComponents/UserDataManager";
import axios from "axios";
import {Path as Path} from "../../Tools/Path";
import WaitingPage from "../WaitingPage";


function EmailConfirmPage(){
    const {ConfirmEmail} = userDataManager()
    const [confirmed, setConfirmed] = useState(false)
    const [errorMsg, setErrorMsg] = useState<null | string>(null)
    const {ReturnToLoginLink} = useFormWrapper();

    const handleConfirmError = (error: unknown) => {
        if (axios.isAxiosError(error))
            if(error.response && error.response?.status === 403)
                setErrorMsg("email został już potwierdzony")
            else if(error.response && error.response?.status === 401)
                setErrorMsg("link jest uszkodzony ")
            else
                setErrorMsg("Nieznany problem")
    }

    const onLaunch = async () => {
        try {

            await ConfirmEmail()
            setConfirmed(true)
        } catch (error) {
            handleConfirmError(error)
        }
    }

    useEffect(
        () => {
            (onLaunch)()
        },
        []
    )

    const EmailConfirmedText = () => {
        return (
            <div className={"text-submit"}>Email został potwierdzony</div>
        )
    }

    const EmailConfirmFailedText = () => {
        return (
            <>
                <div className={"text-submit"}>Nie udało się potwiedzić adresu email</div>
                {errorMsg && <ErrorMessageIfPresentNoContext message={errorMsg!}/>}
            </>
        )
    }

    const navigate = useNavigate()

    const ConfirmForm = () => {
        return (
            <form onSubmit={() => navigate(Path.Default)}>
                {confirmed && <EmailConfirmedText/>}
                {errorMsg && <EmailConfirmFailedText/>}
                <ReturnToLoginLink/>
            </form>
        )
    }

    return (
        <>
            {!confirmed && !errorMsg && <WaitingPage label={"Trwa potwierdzanie adresu email"}/>}
            <Page className={"login-common"}>
                <ConfirmForm/>
            </Page>
        </>
    )
}


export default EmailConfirmPage