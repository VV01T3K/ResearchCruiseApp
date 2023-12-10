import React, {Dispatch, SetStateAction, useState} from 'react';
import CSSModules from 'react-css-modules';
import Style from './style.css'
import LoginForm from "./LoginForm";
import Bg from "../resources/Oceanograf.jpg";
import PageHeader from "../PageHeader/PageHeader";
import ResetPasswordForm from "./ResetPasswordForm";
import RegisterForm from "./RegisterForm";
function LoginPage(props:{className?: string, setUserToken:Dispatch<SetStateAction<string | null>>
    setTitle:Dispatch<SetStateAction<string | null>>}){
    const [currentForm, setCurrentForm] = useState<"login"|"register"|"remind">("login")
    props.setTitle("Login")
    return (
        <>
            <div className={"bg animate"} style={{"backgroundImage":`url(${Bg})`}}></div>
            <div className={" container-xxl h-100 overflow-auto"}>
                <div className={"m-0 p-0"} style={{"height":"84.3px"}}></div>
                <div className={props.className + " d-flex flex-row justify-content-end flex-nowrap"}>
                            <div className="center flex-nowrap col-12 col-md-auto ">
                                <div className="mx-auto pb-1 m-2" style={{minWidth:"300px", maxWidth:"500px", "background": "white"}}>
                                    {currentForm == "login" && <LoginForm setCurrentForm={setCurrentForm} setUserToken={props.setUserToken}/>}
                                    {currentForm == "remind" && <ResetPasswordForm setCurrentForm={setCurrentForm}/>}
                                    {currentForm == "register" && <RegisterForm setCurrentForm={setCurrentForm}/>}
                                </div>
                            </div>
                </div>
            </div>
        </>
    )
}

export default CSSModules(LoginPage, Style);