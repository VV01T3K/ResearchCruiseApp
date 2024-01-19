import React, {useState} from 'react';
import Style from './LoginPage.module.css'
import LoginForm from "./LoginForm";
import ResetPasswordForm from "./ResetPasswordForm";
import RegisterForm from "./RegisterForm";
import Page from "../Tools/Page";
import "./style.css"
function LoginPage(props:{setAuth:(userToken: string | null) => void}){
    const [currentForm, setCurrentForm] = useState<"login"|"register"|"remind">("login")
    return (
        <>
            <Page bgStyle={Style.bgImage + " bg"} className={"justify-content-center justify-content-md-end " + Style}>
                        <div className=" d-flex flex-column pb-1 m-2 center align-self-start"
                             style={{minWidth: "300px", maxWidth: "400px", "background": "white"}}>
                            {currentForm == "login" &&
                                <LoginForm setCurrentForm={setCurrentForm} setAuth={props.setAuth}/>}
                            {currentForm == "remind" && <ResetPasswordForm setCurrentForm={setCurrentForm}/>}
                            {currentForm == "register" && <RegisterForm setCurrentForm={setCurrentForm}/>}
                        </div>

            </Page>
        </>
    )
}

export default LoginPage