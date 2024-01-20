import React, {Dispatch, SetStateAction, useState} from "react";
import {FieldValues, useForm} from "react-hook-form";
import ErrorCode from "./ErrorCode";
import {Link} from "react-router-dom";

function LoginForm(props:{setAuth,
setCurrentForm: Dispatch<SetStateAction<"login"|"remind"|"register">>}){

    const [loginError, setError] = useState<null|string>(null)
    const [ loading, setLoading ] = useState(false);
    async function loginUser(data:FieldValues) {
        return fetch('http://localhost:8080/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(data => {
                if(data.status == 401) throw new Error("Nieprawidłowy adres e-mail lub hasło");
                else if(!data.ok) throw new Error("Wystąpił problem z zalogowaniem, sprawdź połączenie sieciowe")
                else return data.json();
            });
    }

    async function getUserData(accessToken: string) {
        return fetch('http://localhost:8080/account', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken}`,
            },

        })
            .then(data => {
                if(!data.ok) throw new Error("Nie można pobrać roli użytkownika")
                else return data.json();
            });
    }




    const onSubmit = async (data:FieldValues) => {
        setLoading(true);
        try {
            const auth = await loginUser(data);
            const userData = await getUserData(auth["accessToken"])
            props.setAuth({
                accessToken:auth["accessToken"],
                refreshToken:auth["refreshToken"],
                role:userData["roles"][0],
                firstName:userData["firstName"]});
            setError(null)
        }
        catch (e){
            setError(e.message)
        }
        setLoading(false)
    }


    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <>
            <h1 style={{fontSize:"2rem"}}>Logowanie</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="txt_field">
                    <input type="text" disabled={loading} {...register("email",
                        { required: "Pole wymagane", maxLength: 30,
                            // pattern: {
                            // value: /\b[A-Za-z0-9._%+-]+@ug\.edu\.pl\b/,
                            // message: 'Podaj adres e-mail z domeny @ug.edu.pl',
                        // }
                        })}/>
                    <span></span>
                    <label>E-mail</label>
                </div>
                {errors["email"] && <ErrorCode code={errors["email"].message}/>}
                <div className="txt_field">
                    <input type="password" disabled={loading}  {...register("password", { required: "Pole wymagane", maxLength: 30,
                        // pattern: {
                        //     value: /\b(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}\b/,
                        //     message: 'Co najmniej 8 znaków w tym przynajmniej jedna duża litera, mała litera oraz cyfra',
                        // }
                    })}/>
                    <span></span>
                    <label>Hasło</label>
                </div>
                {errors["password"] && <ErrorCode code={errors["password"].message}/>}
                <div className="pass m-2"   onClick={loading ? ()=>{}: ()=>props.setCurrentForm("remind")}>Nie pamiętam hasła</div>
                <input className={loading ? "textAnim": ""} type="submit" disabled={loading} value="Zaloguj się"/>
                {loginError && <ErrorCode code={loginError}/>}
                <div className="signup_link m-3"> Brak konta? <Link to={""}  onClick={loading ? ()=>{}:
                    // ()=>props.setAuth({
                    // accessToken:"tok",
                    // refreshToken:"tik",
                    // role:"Shipowner",
                    // firstName:"cos"})
                    ()=>props.setCurrentForm("register")
                }>Zarejestruj</Link>
                </div>
            </form>
        </>
    )
}
export default LoginForm