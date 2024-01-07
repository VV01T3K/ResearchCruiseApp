import React, {Dispatch, SetStateAction, useState} from "react";
import {FieldValues, useForm} from "react-hook-form";

function RegisterForm(props:{setCurrentForm: Dispatch<SetStateAction<"login"|"remind"|"register">>}){

    async function loginUser(data:FieldValues) {
        return fetch('http://localhost:8080/account/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
            .then(data => {
                if(!data.ok) throw new Error(data.status);
                // else return data.json();
            })
    }

    const onSubmit = async (data:FieldValues) => {
        setLoading(true);
        const token = await loginUser(data);
        // console.log(token[]);
        // if(token[""])
        //     props.setUserToken(token[""]);
        setLoading(false)

    }
    const [ loading, setLoading ] = useState(false);
    const { register, handleSubmit, formState: { errors } } = useForm();




    return (
        <>
            <h1>Register </h1>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="txt_field">
                    <input type="text" disabled={loading} {...register("email", {required: true, maxLength: 100})}/>
                    <span></span>
                    <label>Email</label>
                </div>
                <div className="txt_field">
                    <input type="password" disabled={loading} {...register("password", {
                        required: true,
                        maxLength: 100
                    })}/>
                    <span></span>
                    <label>Password</label>
                </div>
                <div className="txt_field">
                    <input type="text" disabled={loading} {...register("firstname", {
                        required: true,
                        maxLength: 100
                    })}/>
                    <span></span>
                    <label>First name</label>
                </div>
                <div className="txt_field">
                    <input type="text" disabled={loading} {...register("lastname", {
                        required: true,
                        maxLength: 100
                    })}/>
                    <span></span>
                    <label>Last name</label>
                </div>
                <input type="submit" value="Confirm"/>
                <div className="signup_link">
                    Already member? <a href="#" onClick={() => props.setCurrentForm("login")}>Login</a>
                </div>
            </form>
        </>
    )
}

export default RegisterForm