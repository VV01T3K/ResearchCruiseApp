import React, {Dispatch, SetStateAction, useState} from "react";
import {FieldValues, useForm} from "react-hook-form";
import ErrorCode from "./ErrorCode";

function ResetPasswordForm(props:{setCurrentForm: Dispatch<SetStateAction<"login"|"remind"|"register">>}){
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [resetError, setError] = useState<null|string>(null)
    const [ resetSuccessful, setResetSuccessful ] = useState(false);

    async function resetPassword(data:FieldValues) {
        return fetch('http://localhost:8080/account/reset', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(data => {
                if(!data.ok) setError("Wystąpił problem z resetowaniem hasła")
                else return data.json();
            })
    }

        const onSubmit = async (data:FieldValues) => {
            setLoading(true);
            try {
                await resetPassword(data);
                setError(null)
                setResetSuccessful(true)
            }
            catch (e){
                setError("Wystąpił problem z zalogowaniem, sprawdź połączenie z internetem")
            }
            setLoading(false)
        }

    const [ loading, setLoading ] = useState(false);

    return (
        <>
            <h1 style={{fontSize:"2rem"}}>Resetowanie hasła</h1>
            {!resetSuccessful &&
            <form  onSubmit={handleSubmit(onSubmit)}>
                <div className="txt_field">
                    <input type="text" disabled={loading} {...register("email", { required: "Pole wymagane", maxLength: 30,  pattern: {
                            value: /\b[A-Za-z0-9._%+-]+@ug\.edu\.pl\b/,
                            message: 'Podaj adres e-mail z domeny @ug.edu.pl',
                        }})}/>
                    <span></span>
                    <label>E-mail</label>
                </div>
                {errors["email"] && <ErrorCode code={errors["email"].message}/>}

                <div className="pass m-1" onClick={()=>props.setCurrentForm("login")}>Znasz hasło?</div>
                <input type="submit" value="Potwierdź" />
                {resetError && <ErrorCode code={resetError}/>}

                <div className="signup_link m-3">
                    Brak konta? <a href="#" onClick={()=>props.setCurrentForm("register")}>Zarejestruj</a>
                </div>
            </form>}
            {resetSuccessful && <>
                <div className="signup_link m-3 text-break">
                    <div style={{fontSize:"1.3rem"}}>Jeśli konto istnieje, został wysłany link do zmiany hasła na podany adres e-mail</div>
                    <div className={"butt p-2 mt-2"}>
                        <a className={"text-white"} href="#" onClick={() => props.setCurrentForm("login")}>
                            Powrót do logowania
                        </a>
                    </div>
                </div>
            </>}
        </>
    )
}
export default ResetPasswordForm