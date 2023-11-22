import React, {Dispatch, SetStateAction, useState} from 'react';
import CSSModules from 'react-css-modules';
import Style from './style.css'
import LoginForm from "./LoginForm";
import Bg from "../resources/Oceanograf.jpg";
import PageHeader from "../PageHeader/PageHeader";
import ResetPasswordForm from "./ResetPasswordForm";
import RegisterForm from "./RegisterForm";
function LoginPage(props:{className?: string, setUserToken:Dispatch<SetStateAction<string | null>>}){
    const [currentForm, setCurrentForm] = useState<"login"|"register"|"remind">("login")
    return (
        <>
            <div className={"bg"} style={{"backgroundImage":`url(${Bg})`}}></div>
            <PageHeader></PageHeader>
            <div className={props.className + " d-flex flex-row justify-content-end flex-nowrap m-4"}>
                        <div className="center flex-nowrap  col-12 col-md-auto my-auto ">
                            <div className="mx-auto pb-1" style={{"width":"500px",  "background": "white"}}>
                                {currentForm == "login" && <LoginForm setCurrentForm={setCurrentForm} setUserToken={props.setUserToken}/>}
                                {currentForm == "remind" && <ResetPasswordForm setCurrentForm={setCurrentForm}/>}
                                {currentForm == "register" && <RegisterForm setCurrentForm={setCurrentForm}/>}
                            </div>
                        </div>
            </div>
        </>
    )
}

export default CSSModules(LoginPage, Style);