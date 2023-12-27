import React, { useState} from "react";
import {FieldValues, useForm} from "react-hook-form";
import Page from "../Tools/Page";
import ErrorCode from "../LoginPage/ErrorCode";
function FormA0(){


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
            <Page className={"bg-white d-flex flex-row"}>
                <>
                <h1 className={"d-flex flex-column"}>Formularz A wita</h1>
                {/*<form  className={"d-flex flex-column"} onSubmit={handleSubmit(onSubmit)}>*/}
                {/*    <div className="txt_field">*/}
                {/*        <input type="text" disabled={loading} {...register("userName", { required: true, maxLength: 10 })}/>*/}
                {/*        <span></span>*/}
                {/*        <label>Username</label>*/}

                {/*    </div>*/}
                {/*    {errors.userName && <ErrorCode code={"Username -> sXXXXXXX or email@ug.edu.pl"}/>}*/}
                {/*    <div className="txt_field">*/}
                {/*        <input type="password" disabled={loading}  {...register("password", { required: true, maxLength: 10 })}/>*/}
                {/*        <span></span>*/}
                {/*        <label>Password</label>*/}
                {/*    </div>*/}
                {/*    {errors.password && <ErrorCode code={"Password -> daj dobre hasło"}/>}*/}

                {/*</form>*/}
                </>
            </Page>

    )
}
export default FormA0