import React from 'react';
import Style from './LoginPage.module.css'
import LoginForm from "./LoginForm";
import ResetPasswordForm from "./ResetPasswordForm";
import RegisterForm from "./RegisterForm";
import Page from "../Page";
import "./style.css"
import {Route, Routes} from "react-router-dom";


function LoginPage(){
    return (
        <>
            <Page bgStyle={Style.bgImage + " bg"} className={"justify-content-center w-100 justify-content-md-end " + Style}>
                <div className="d-flex flex-column pb-1 m-2 center align-self-start"
                     style={{minWidth: "300px", maxWidth: "400px", "background": "white"}}
                >
                    <Routes>
                        <Route path="/*" element={<LoginForm />} />
                        <Route path="/rejestracja" element={<RegisterForm />} />
                        <Route path="/przypominanieHasla" element={<ResetPasswordForm />} />
                    </Routes>
                </div>
            </Page>
        </>
    )
}


export default LoginPage