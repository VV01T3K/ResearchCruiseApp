import React, {Dispatch, SetStateAction} from "react";

function RegisterForm(props:{setCurrentForm: Dispatch<SetStateAction<"login"|"remind"|"register">>}){
    return (
        <>
            <h1>Register </h1>
            <form method="post">
                <div className="txt_field">
                    <input type="text" required/>
                    <span></span>
                    <label>Username</label>
                </div>
                <div className="txt_field">
                    <input type="text" required/>
                    <span></span>
                    <label>E-mail</label>
                </div>
                <div className="txt_field">
                    <input type="password" required/>
                    <span></span>
                    <label>Password</label>
                </div>
                <div className="txt_field">
                    <input type="password" required/>
                    <span></span>
                    <label>Confirm password</label>
                </div>
                <input type="submit" value="Confirm" />
                <div className="signup_link">
                    Already member? <a href="#" onClick={()=>props.setCurrentForm("login")} >Login</a>
                </div>
            </form>
        </>
    )
}
export default RegisterForm