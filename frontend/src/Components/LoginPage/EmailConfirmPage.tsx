import React, {useEffect, useState} from 'react';
import Style from './LoginPage.module.css'
import Page from "../Tools/Page";
import "./style.css"
import {Link, useParams} from "react-router-dom";
function EmailConfirmPage(){
    const [confirmed, setConfirmed] = useState(false)
    const [errorMsg, setErrorMsg] = useState<null|string>(null)
    const { token } = useParams();
    useEffect(() => {
        async function confirmEmail() {
            try {
                console.log(token)
                const  response = await fetch('http://localhost:8080/account/confirmEmail', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ token }),
                })
                    .then(data => {
                        if(data.ok)
                            return data.json();
                        else throw new Error("problem")
                    })
                setConfirmed(true)
            }
            catch (e){
                setErrorMsg(e.toString())

            }
        }
        confirmEmail();
    }, [token])

    return (
        <>
            <Page bgStyle={Style.bgImage + " bg"} className={"justify-content-center justify-content-md-end " + Style}>
                        <div className=" d-flex flex-column pb-1 m-2 center align-self-start"
                             style={{minWidth: "300px", maxWidth: "400px", "background": "white"}}>
                            { confirmed &&
                                <div className="signup_link m-3 text-break">
                                    <div style={{fontSize:"1.3rem"}}>Email został potwierdzony</div>
                                    <div className={"butt p-2 mt-2"}>
                                        <Link className={"text-white"} to="/">
                                            Powrót do logowania
                                        </Link>
                                    </div>
                                </div>
                            }
                            { !confirmed &&
                                <div className="signup_link m-3 text-break">
                                    <div style={{fontSize:"1.3rem"}}>Nie udało się potwiedzić adresu email</div>
                                    <div className={"butt p-2 mt-2"}>
                                        <Link className={"text-white"} to="/">
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