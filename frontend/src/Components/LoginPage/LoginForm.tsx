import React, {Dispatch, SetStateAction, useState} from "react";
import {FieldValues, useForm, useFormState} from "react-hook-form";
import ErrorCode from "./ErrorCode";

function LoginForm(props:{setUserToken: (userToken: string | null) => void,
setCurrentForm: Dispatch<SetStateAction<"login"|"remind"|"register">>}){


    async function loginUser(data:FieldValues) {
        return fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data, null, 2)
        })
            .then(data => data.json())
    }

    const onSubmit = async (data:FieldValues) => {
        setLoading(true);
        const token = await loginUser(data);
        props.setUserToken(token);
        setLoading(false)

    }
    const [ loading, setLoading ] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();

    return (
        <>
            <h1>Login</h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="txt_field">
                    <input type="text" disabled={loading} {...register("userName", { required: true, maxLength: 10 })}/>
                    <span></span>
                    <label>Username</label>

                </div>
                {errors.userName && <ErrorCode code={"Username -> sXXXXXXX or email@ug.edu.pl"}/>}
                <div className="txt_field">
                    <input type="password" disabled={loading}  {...register("password", { required: true, maxLength: 10 })}/>
                    <span></span>
                    <label>Password</label>
                </div>
                {errors.password && <ErrorCode code={"Password -> daj dobre hasło"}/>}
                <div className="pass m-2"   onClick={loading ? ()=>{}: ()=>props.setCurrentForm("remind")}>Forgot Password?</div>
                <input className={loading ? "textAnim": ""} type="submit" disabled={loading} value="Login"/>
                <div className="signup_link m-2">
                    Not a member? // Skip login <a href="#"  onClick={loading ? ()=>{}: ()=>props.setUserToken(" ") }>Signup</a> {/*()=>props.setCurrentForm("register")*/}
                </div>
            </form>
        </>
    )
}
export default LoginForm