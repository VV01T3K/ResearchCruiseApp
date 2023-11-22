import React, {Dispatch, SetStateAction} from "react";

function ResetPasswordForm(props:{setCurrentForm: Dispatch<SetStateAction<"login"|"remind"|"register">>}){
    return (
        <>
            <h1>Reset password</h1>
            <form method="post">
                <div className="txt_field">
                    <input type="text" required/>
                    <span></span>
                    <label>e-mail</label>
                </div>
                <div className="pass" onClick={()=>props.setCurrentForm("login")}>Knows Password?</div>
                <input type="submit" value="Confirm" />
                <div className="signup_link">
                    Not a member? <a href="#" onClick={()=>props.setCurrentForm("register")}>Signup</a>
                </div>
            </form>
        </>
    )
}
export default ResetPasswordForm