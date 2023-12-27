import React, {useState} from 'react';
import CSSModules from 'react-css-modules';
import Style from './style.css'
import LoginForm from "./LoginForm";
import ResetPasswordForm from "./ResetPasswordForm";
import RegisterForm from "./RegisterForm";
import Page from "../Tools/Page";
function LoginPage(props:{className?: string, setUserToken:(userToken: string | null) => void}){
    const [currentForm, setCurrentForm] = useState<"login"|"register"|"remind">("login")
    return (
        <>
            <Page className={props.className}>
                        <div className=" pb-1 m-2 center"
                             style={{minWidth: "300px", maxWidth: "400px", "background": "white"}}>
                            {currentForm == "login" &&
                                <LoginForm setCurrentForm={setCurrentForm} setUserToken={props.setUserToken}/>}
                            {currentForm == "remind" && <ResetPasswordForm setCurrentForm={setCurrentForm}/>}
                            {currentForm == "register" && <RegisterForm setCurrentForm={setCurrentForm}/>}
                        </div>

            </Page>
        </>
    )
}

export default CSSModules(LoginPage, Style);