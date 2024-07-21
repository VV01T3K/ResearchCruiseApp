import React, {useState} from "react";
import {FieldValues, useForm} from "react-hook-form";
import ErrorCode from "../CommonComponents/ErrorCode";
import {Link} from "react-router-dom";
import Api from "../../Tools/Api";
import useCustomEvent from "../../Tools/useCustomEvent";
import {Simulate} from "react-dom/test-utils";
import reset = Simulate.reset; Api;


function LoginForm(){
    const [loginError, setError] = useState<null | string>(null)
    const [loading, setLoading ] = useState(false);

    async function loginUser(data: FieldValues){
        return Api
            .post('/account/login', data, {raw: true})
            .then((response) => {
                Object.entries(response.data).forEach(([key, value]) => {
                    sessionStorage.setItem(key, value as string);
                });
                setError(null)
            }).catch(error => {
                if (error.response && error.response.status === 401) {
                    setError("Podano błędne hasło lub użytkownik nie istnieje")
                }
                else setError("Wystąpił problem z zalogowaniem, spróbuj ponownie później")
                setValue('password', '');
            });
    }

    const { dispatchEvent } = useCustomEvent('loginSuccessful');

    const onSubmit = async (data: FieldValues) => {
        setLoading(true);
        await loginUser(data);
        setLoading(false)
        dispatchEvent(null);
    }


    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors}
    } = useForm();

    return (
        <>
            <h1 style={{fontSize:"2rem"}}>Logowanie</h1>

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="txt_field">
                    <input type="text"
                           disabled={loading}
                           {...register("email", { required: "Pole wymagane", maxLength: 30, })}
                            // pattern: {
                            // value: /\b[A-Za-z0-9._%+-]+@ug\.edu\.pl\b/,
                            // message: 'Podaj adres e-mail z domeny @ug.edu.pl',
                        // }
                    />
                    <label>E-mail</label>
                </div>
                {errors["email"] && <ErrorCode code={errors["email"].message} />}

                <div className="txt_field">
                    <input type="password"
                           disabled={loading}
                           {...register("password", { required: "Pole wymagane", maxLength: 30, })}
                        // pattern: {
                        //     value: /\b(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}\b/,
                        //     message: 'Co najmniej 8 znaków w tym przynajmniej jedna duża litera, mała litera oraz cyfra',
                        // }
                    />
                    <label>Hasło</label>
                </div>
                {errors["password"] && <ErrorCode code={errors["password"].message} />}

                <div className={"m-2"}>
                    <Link className="pass"
                          to="/przypominanieHasla"
                          onClick={(event) => {
                              loading ? event.preventDefault() : null
                          }}
                    >
                        Nie pamiętam hasła
                    </Link>
                </div>

                <input className={loading ? "textAnim": ""} type="submit" disabled={loading} value="Zaloguj się" />
                {loginError && <ErrorCode code={loginError} />}

                <div className="signup_link m-3">
                    Brak konta? <span/>
                    <Link to="/rejestracja"
                          onClick={(event) => {
                              loading ? event.preventDefault() : null
                          }}
                    >
                        Zarejestruj się
                    </Link>
                </div>
            </form>
        </>
    )
}


export default LoginForm