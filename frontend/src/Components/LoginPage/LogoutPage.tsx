import React from 'react';
import Style from './LoginPage.module.css'
import Page from "../Tools/Page";
import "./style.css"


function LogoutPage(){
    return (
        <>
            <Page bgStyle={"bg " + Style.bgImage} className={"justify-content-center justify-content-md-end " + Style}>
                <div className="d-flex flex-column pb-1 m-2 center align-self-start"
                     style={{minWidth: "300px", maxWidth: "400px", "background": "white"}}
                >
                    <div className="signup_link m-3 text-break">
                        <div style={{fontSize:"1.3rem"}}>Nastąpiło wylogowanie</div>
                        <div className="butt p-2 mt-2">
                            <a className="text-white" href="/">
                                Powrót do logowania
                            </a>
                        </div>
                    </div>
                </div>
            </Page>
        </>
    )
}


export default LogoutPage