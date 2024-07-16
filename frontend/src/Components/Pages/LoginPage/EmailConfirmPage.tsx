import React, {useEffect, useState} from 'react';
import Style from './LoginPage.module.css'
import Page from "../Page";
import "./style.css"
import {Link, useLocation} from "react-router-dom";
import {ErrorMessage} from "react-image-size/lib/lib/constants";
import ErrorCode from "./ErrorCode";
import Api from "../../Tools/Api";


function EmailConfirmPage(){
    const [confirmed, setConfirmed] = useState(false)
    const [errorMsg, setErrorMsg] = useState<null | string>(null)
    const { search} = useLocation();

    useEffect(
        () => {
            const searchParams = new URLSearchParams(search);
            const userIdParam = searchParams.get('userId');
            const codeParam = searchParams.get('code');

            function confirmEmail(){
                Api.
                    get(`/account/confirmEmail?userId=${userIdParam}&code=${codeParam}`)
                    .then(response =>
                        setConfirmed(true)
                    )
                    .catch(error => {
                        setErrorMsg(error.message)
                    })
            }

            confirmEmail();
        },
        []
    )

    return (
        <>
            <Page bgStyle={Style.bgImage + " bg"}
                  className={"justify-content-center justify-content-md-end " + Style}
            >
                        <div className="d-flex flex-column pb-1 m-2 center align-self-start"
                             style={{minWidth: "300px", maxWidth: "400px", "background": "white"}}
                        >
                            {confirmed &&
                                <div className="signup_link m-3 text-break">
                                    <div style={{fontSize:"1.3rem"}}>Email został potwierdzony</div>
                                    <div className="butt p-2 mt-2">
                                        <Link className="text-white" to="/">
                                            Powrót do logowania
                                        </Link>
                                    </div>
                                </div>
                            }
                            {errorMsg &&
                                <div className="signup_link m-3 text-break">
                                    <div style={{fontSize:"1.3rem"}}>Nie udało się potwiedzić adresu email</div>
                                    {ErrorMessage && <ErrorCode code={errorMsg}/>}
                                    <div className="butt p-2 mt-2">
                                        <Link className="text-white" to="/">
                                            Powrót do logowania
                                        </Link>
                                    </div>
                                </div>
                            }
                        </div>
            </Page>
        </>
    )
}


export default EmailConfirmPage