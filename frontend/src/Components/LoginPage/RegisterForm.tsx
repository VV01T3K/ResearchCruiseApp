import React, {Dispatch, SetStateAction, useState} from "react";
import {FieldValues, useForm} from "react-hook-form";
import ErrorCode from "./ErrorCode";

function RegisterForm(props:{setCurrentForm: Dispatch<SetStateAction<"login"|"remind"|"register">>}){

    const [registerError, setError] = useState<null|string>(null)

    async function registerUser(data:FieldValues) {
        return fetch('http://localhost:8080/account/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(data => {
                if(data.status == 400) throw new Error("Użytkownik o podanym adresie e-mail już istnieje");
                else if(!data.ok) throw new Error("Wystąpił problem z rejestracją, sprawdź połączenie z internetem")
            });
    }

    const onSubmit = async (data:FieldValues) => {
        const { password2, ...dataWithoutPassword2 } = data;
        setLoading(true);
        try {
            await registerUser(data);
            setError(null)
            setRegisterSuccessful(true)
        }
        catch (e){
            setError(e.message)
        }
        setLoading(false)

    }
    const [ loading, setLoading ] = useState(false);
    const { register, handleSubmit, watch, formState: { errors } } = useForm();
    const [ registerSuccessful, setRegisterSuccessful ] = useState(false);




    return (
        <>
            <h1 style={{fontSize:"2rem"}}>Rejestracja</h1>
            {!registerSuccessful &&
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="txt_field">
                    <input type="text" disabled={loading} {...register("email", { required: "Pole wymagane", maxLength: 30,
                        // pattern: {
                        //     value: /\b[A-Za-z0-9._%+-]+@ug\.edu\.pl\b/,
                        //     message: 'Podaj adres e-mail z domeny @ug.edu.pl',
                        // }
                    })}/>
                    <span></span>
                    <label>Adres e-mail</label>
                </div>
                {errors["email"] && <ErrorCode code={errors["email"]!.message}/>}
                <div className="txt_field">
                    <input type="text" disabled={loading} {...register("firstName", {
                        required: "Pole wymagane",
                        maxLength: 100
                    })}/>
                    <span></span>
                    <label>Imię</label>
                </div>
                {errors["firstName"] && <ErrorCode code={errors["firstName"]!.message}/>}

                <div className="txt_field">
                    <input type="text" disabled={loading} {...register("lastName",
                        {
                            required: "Pole wymagane",
                            maxLength: 100
                        })}/>
                    <span></span>
                    <label>Nazwisko</label>
                </div>
                {errors["lastName"] && <ErrorCode code={errors["lastName"]!.message}/>}
                <div className="txt_field">
                    <input type="password" disabled={loading} {...register("password", { required: "Pole wymagane", maxLength: 30, pattern: {
                            value: /\b(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}\b/,
                            message: 'Co najmniej 8 znaków, w tym przynajmniej jedna duża litera, mała litera oraz cyfra',
                        } })}/>
                    <span></span>
                    <label>Hasło</label>
                </div>
                {errors["password"] && <ErrorCode code={errors["password"]!.message}/>}
                <div className="txt_field">
                    <input type="password" disabled={loading} {...register("password2", { required: "Pole wymagane", maxLength: 30,
                        validate: (value) => value === watch('password') || 'Hasła nie pasują do siebie',
                    })}/>
                    <span></span>
                    <label>Potwierdź hasło</label>
                </div>
                {errors["password2"] && <ErrorCode code={errors["password2"]!.message}/>}
                <input className={loading ? "textAnim": "" + " mt-2"} type="submit" disabled={loading} value="Potwiedź"/>
                {registerError && <ErrorCode code={registerError}/>}
                <div className="signup_link m-3">
                    Posiadasz konto? <a href="#" onClick={() => props.setCurrentForm("login")}>Logowanie</a>
                </div>
            </form>
            }
            {registerSuccessful &&
                <>
                    <div className="signup_link m-3 text-break">
                        <div style={{fontSize:"1.3rem"}}>Rejestracja przebiegła pomyślnie, potwierdź rejestrację poprzez link wysłany na adres e-mail i oczekuj zatwierdzenia konta
                            przez biuro armatora</div>
                        <div className={"butt p-2 mt-2"}>
                        <a className={"text-white"} href="#" onClick={() => props.setCurrentForm("login")}>
                                Powrót do logowania
                        </a>
                        </div>
                    </div>
                </>

            }
        </>
    )
}

export default RegisterForm