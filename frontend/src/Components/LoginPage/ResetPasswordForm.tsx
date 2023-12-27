import React, {Dispatch, SetStateAction, useState} from "react";
import {FieldValues, useForm} from "react-hook-form";
import ErrorCode from "./ErrorCode";

function ResetPasswordForm(props:{setCurrentForm: Dispatch<SetStateAction<"login"|"remind"|"register">>}){
    const { register, handleSubmit, formState: { errors } } = useForm();
    async function resetPassword(data:FieldValues) {
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
        const token = await resetPassword(data);
        setLoading(false)

    }
    const [ loading, setLoading ] = useState(false);

    return (
        <>
            <h1>Reset password</h1>
            <form  onSubmit={handleSubmit(onSubmit)}>
                <div className="txt_field">
                    <input disabled={loading}  {...register("mail", { required: true,
                        validate: {
                            maxLength: (v) =>
                                v.length <= 50 || "The email should have at most 50 characters",
                            matchPattern: (v) =>
                                /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || "Email address must be a valid address"}})}/>
                    <span></span>
                    <label>e-mail</label>
                </div>
                {errors.mail && <ErrorCode code={errors.mail.message?.toString()!}/>}

                <div className="pass m-1" onClick={()=>props.setCurrentForm("login")}>Knows Password?</div>
                <input type="submit" value="Confirm" />
                <div className="signup_link m-2">
                    Not a member? <a href="#" onClick={()=>props.setCurrentForm("register")}>Signup</a>
                </div>
            </form>
        </>
    )
}
export default ResetPasswordForm