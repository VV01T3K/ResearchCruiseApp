import React from 'react';
import Page from "../Page";
import "./style.css"
import {Link, useNavigate} from "react-router-dom";
import useFormWrapper from "../../CommonComponents/useFormWrapper";
import {PathName as Path} from "../../Tools/PathName";

function LogoutPage(){
    const {ReturnToLoginLink} = useFormWrapper()
    const navigate = useNavigate()

    const LogoutForm = () => {
        return (
            <form onSubmit={() => navigate(Path.Default)}>
                <div className={"text-submit"}>Nastąpiło wylogowanie</div>
                <ReturnToLoginLink/>
            </form>
        )
    }
    return (
        <>
            <Page className={"login-common"}>
                <LogoutForm/>
            </Page>
        </>
    )
}


export default LogoutPage