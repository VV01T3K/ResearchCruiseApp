import React, {useState} from "react";
import {FieldValues, useForm} from "react-hook-form";
import ErrorCode from "../CommonComponents/ErrorCode";
import Api from "../../Tools/Api";
import {Link} from "react-router-dom";


function ResetPasswordForm(){
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();
    const [resetError, setError] = useState<null | string>(null)
    const [resetSuccessful, setResetSuccessful] = useState(false);

    async function resetPassword(data: FieldValues){
        return Api.post('/account/reset', data)
    }

    const onSubmit = async (data: FieldValues) => {
        setLoading(true);
        try {
            await resetPassword(data);
            setError(null)
            setResetSuccessful(true)
        }
        catch (e) {
            setError("Wystąpił problem z resetowaniem hasła")
        }
        setLoading(false)
    }

    const [loading, setLoading] = useState(false);

    return (
        <>
            <h1 style={{fontSize:"2rem"}}>Resetowanie hasła</h1>
            {!resetSuccessful &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="txt_field">
                        <input type="text"
                               disabled={loading}
                               {...register(
                                   "email",
                                   {
                                       required: "Pole wymagane",
                                       maxLength: 30,
                                       pattern: {
                                           value: /\b[A-Za-z0-9._%+-]+@ug\.edu\.pl\b/,
                                           message: 'Podaj adres e-mail z domeny @ug.edu.pl',
                                       }
                                   }
                               )}
                        />
                        <span />
                        <label>E-mail</label>
                    </div>
                    {errors["email"] && <ErrorCode code={errors["email"].message} />}

                    <div className="pass m-2">
                        <Link className="pass" to="/">Znasz hasło?</Link>
                    </div>
                    <input type="submit" value="Potwierdź" />
                    {resetError && <ErrorCode code={resetError} />}

                    <div className="signup_link m-3">
                        Brak konta? <Link to="/rejestracja">Zarejestruj</Link>
                    </div>
                </form>
            }
            {resetSuccessful &&
                <>
                    <div className="signup_link m-3 text-break">
                        <div style={{fontSize:"1.3rem"}}>
                            Jeśli konto istnieje, został wysłany link do zmiany hasła na podany adres e-mail
                        </div>
                        <div className="butt p-2 mt-2">
                            <Link className="text-white" to="/">
                                Powrót do logowania
                            </Link>
                        </div>
                    </div>
                </>
            }
        </>
    )
}


export default ResetPasswordForm