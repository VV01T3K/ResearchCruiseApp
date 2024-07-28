import React, {useState} from "react";
import {FieldValues} from "react-hook-form";
import ErrorCode from "../CommonComponents/ErrorCode";
import {Link} from "react-router-dom";
import RegisterSuccessful from "./RegisterSuccessful";
import useFormWrapper from "../../CommonComponents/useFormWrapper";
import axios from "axios";
import userDataManager from "../../CommonComponents/UserDataManager";


function RegisterForm(){
    const {Register} = userDataManager()
    const {
        reset, handleSubmit,
        formState: { errors }, EmailTextInput, LastNameTextInput, FirstNameTextInput,
        ConfirmPasswordTextInput, PasswordTextInput, ConfirmButton, setDisabled
    } = useFormWrapper();
    const [registerError, setRegisterError] = useState<null | string>(null)
    const [registerSuccessful, setRegisterSuccessful] = useState(false);

    const BeforeSubmit = () => {
        setDisabled(true);
        setRegisterError(null)
    }

    const AfterError = () => {
        setDisabled(false)
    }

    const AfterRegisterSuccess = () => {
        setRegisterError(null)
        setRegisterSuccessful(true)
        reset()
    }

    const HandleRegisterError = (error:unknown) => {
        if(axios.isAxiosError(error))
            if (error.response && error.response.status === 400) {
                setRegisterError("Dane są niepoprawne lub użytkownik istnieje")
            }
            else setRegisterError("Wystąpił problem z rejestracją spróbuj ponownie później")
        AfterError()
    }
    const onSubmit = async (data: FieldValues)=> {
        BeforeSubmit()
        try {
            await Register(data);
            AfterRegisterSuccess()
        } catch (error){
           HandleRegisterError(error)
        }
    }

    const LoginLink = () => {
        return (
            <div className="signup-link">
                Posiadasz konto? <Link to="/">Logowanie</Link>
            </div>
        )
    }
    return (
        <>
            <h1 style={{fontSize: "2rem"}}>Rejestracja</h1>
            {!registerSuccessful &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <EmailTextInput/>
                    <FirstNameTextInput/>
                    <LastNameTextInput/>
                    <PasswordTextInput/>
                    <ConfirmPasswordTextInput/>
                    <ConfirmButton/>
                    {registerError && <ErrorCode code={registerError} />}
                    <LoginLink/>
                </form>
            }
            {registerSuccessful &&<RegisterSuccessful />}
        </>
    )
}


export default RegisterForm