import React, {useState} from "react";
import {FieldValues} from "react-hook-form";
import ErrorCode from "../CommonComponents/ErrorCode";
import {Link, useNavigate} from "react-router-dom";
import {PathName as Path} from "../../Tools/PathName";
import userDataManager from "../../CommonComponents/UserDataManager";
import useFormWrapper from "../../CommonComponents/useFormWrapper";


function ResetPasswordForm(){
    const {ResetPassword} = userDataManager()
    const { handleSubmit, EmailTextInput, ConfirmButton, RegisterLink, setDisabled
    } = useFormWrapper();
    const [resetError, setError] = useState<null | string>(null)
    const [resetSuccessful, setResetSuccessful] = useState(false);

    const navigate = useNavigate()
    const onSubmit = async (data: FieldValues) => {
        setDisabled(true)
        try {
            await ResetPassword(data);
            setResetSuccessful(true)
        }
        catch (e) {
            setError("Wystąpił problem z resetowaniem hasła")
            setDisabled(false)
        }
    }

    const onSubmitWhenSuccess = () => {
        navigate(Path.Default)
    }

    const RememberPasswordLink = () => {
        return (
            <Link className="forget-password-link" to={Path.Default}>Znasz hasło?</Link>
        )
    }

    const ReturnToLoginLink = () => {

        return (
            <input type={"submit"} className="login-common-submit" value={"Powrót do logowania"}/>
        )
    }

    const DefaultForm = () => {
        return (
            <form onSubmit={handleSubmit(onSubmit)}>
                <EmailTextInput/>
                <RememberPasswordLink/>
                <ConfirmButton/>
                {resetError && <ErrorCode code={resetError}/>}
                <RegisterLink/>
            </form>
        )
    }

    const FormAfterResetSuccess = () => {
        return (
            <form onSubmit={handleSubmit(onSubmitWhenSuccess)}>
                <div style={{fontSize: "1.3rem"}}>
                    Jeśli konto istnieje, został wysłany link do zmiany hasła na podany adres e-mail
                </div>
                <ReturnToLoginLink/>
            </form>
        )
    }

    return (
        <>
            <h1 className={"login-common-header"}>Resetowanie hasła</h1>
            {!resetSuccessful && <DefaultForm/>}
            {resetSuccessful && <FormAfterResetSuccess/>}
        </>
    )
}


export default ResetPasswordForm