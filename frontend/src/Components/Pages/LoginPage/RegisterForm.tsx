import React, {useState} from "react";
import {FieldValues, useForm} from "react-hook-form";
import ErrorCode from "../CommonComponents/ErrorCode";
import {Link} from "react-router-dom";
import Api from "../../Tools/Api";
import {Error} from "react-image-size";
import RegisterSuccessful from "./RegisterSuccessful";


function RegisterForm(){
    const {
        reset,
        register,
        handleSubmit,
        watch,
        formState: { errors }
    } = useForm();
    const [registerError, setError] = useState<null | string>(null)

    async function registerUser(data: FieldValues){
        return Api
            .post('/account/register', data)
            .then((response: { status: number; data: any; }) => {
                setError(null)
                setRegisterSuccessful(true)
                reset()
                    return response.data;
            }).catch(error => {
                if (error.response && error.response.status === 401) {
                    setError("Nieprawidłowy adres e-mail lub hasło")
                }
                else setError("Wystąpił problem z rejestracją spróbuj ponownie później")
            });
    }

    const onSubmit = async (data: FieldValues)=> {
        setLoading(true);
        await registerUser(data);
        setLoading(false)
    }

    const [loading, setLoading] = useState(false);

    const [registerSuccessful, setRegisterSuccessful] = useState(false);

    return (
        <>
            <h1 style={{fontSize:"2rem"}}>Rejestracja</h1>
            {!registerSuccessful &&
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="txt_field">
                        <input type="text"
                               disabled={loading}
                               {...register("email", { required: "Pole wymagane", maxLength: 30, })}
                        // pattern: {
                        //     value: /\b[A-Za-z0-9._%+-]+@ug\.edu\.pl\b/,
                        //     message: 'Podaj adres e-mail z domeny @ug.edu.pl',
                        // }
                        />
                        <label>Adres e-mail</label>
                    </div>
                    {errors["email"] && <ErrorCode code={errors["email"]!.message} />}

                    <div className="txt_field">
                        <input type="text"
                               disabled={loading}
                               {...register("firstName", { required: "Pole wymagane", maxLength: 100 })}
                        />
                        <label>Imię</label>
                    </div>
                    {errors["firstName"] && <ErrorCode code={errors["firstName"]!.message} />}

                    <div className="txt_field">
                        <input type="text"
                               disabled={loading}
                               {...register("lastName",{ required: "Pole wymagane", maxLength: 100 })}
                        />
                        <label>Nazwisko</label>
                    </div>
                    {errors["lastName"] && <ErrorCode code={errors["lastName"]!.message} />}

                    <div className="txt_field">
                        <input type="password"
                               disabled={loading}
                               {...register(
                                   "password",
                                   {
                                       required: "Pole wymagane",
                                       maxLength: 30,
                                       pattern: {
                                           value: /\b(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}\b/,
                                           message:
                                               'Co najmniej 8 znaków, w tym przynajmniej jedna duża litera, mała' +
                                               'litera oraz cyfra',
                                       }
                                   }
                               )}
                        />
                        <label>Hasło</label>
                    </div>
                    {errors["password"] && <ErrorCode code={errors["password"]!.message} />}

                    <div className="txt_field">
                        <input type="password"
                               disabled={loading}
                               {...register(
                                   "confirmPassword",
                                   {
                                       required: "Pole wymagane",
                                       maxLength: 30,
                                       validate: (value) => value === watch('password') || 'Hasła nie pasują do siebie',
                                   }
                               )}
                        />
                        <label>Potwierdź hasło</label>
                    </div>
                    {errors["password2"] && <ErrorCode code={errors["password2"]!.message} />}

                    <input className={loading ? "textAnim": "" + " mt-2"}
                           type="submit"
                           disabled={loading}
                           value="Potwiedź"
                    />
                    {registerError && <ErrorCode code={registerError} />}

                    <div className="signup_link m-3">
                        Posiadasz konto?  <Link to="/">Logowanie</Link>
                    </div>
                </form>
            }

            {registerSuccessful &&<RegisterSuccessful />}
        </>
    )
}


export default RegisterForm