import React from 'react';
import Page from "../Page";
import PageTitle from "../CommonComponents/PageTitle";
import ChangePasswordForm from "./ChangePasswordForm";
import {UserCredentials} from "./UserCredentials";

function AccountPage() {

    const ChangePasswordColumn = () => (
        <div className="account-page-change-password-column">
            <ChangePasswordForm/>
        </div>
    )
    const CredentialsColumn = () => (
        <div className="account-page-credentials-column">
            <UserCredentials/>
        </div>
    )
    return (
        <Page className={"bg-white d-flex flex-column"}>
            <PageTitle title={"Ustawienia konta"}/>
            <div className="account-page-data-row">
                    <CredentialsColumn/>
                    <ChangePasswordColumn/>
            </div>
        </Page>
    )
}


export default AccountPage