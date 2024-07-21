import PageTitle from "./CommonComponents/PageTitle";
import ApplicationsList from "./ApplicationsPage/ApplicationsList";
import Page from "./Page";
import React from "react";
import ButtonWithState from "../CommonComponents/ButtonWithState";
import MyApplicationsList from "./MyApplicationsList";
const newFormAState = {
    formType: "A",
}
function MyApplicationsPage() {
    return (
        <Page className="justify-content-center col-12 col-xl-9 bg-white">
            <div className="d-flex flex-column w-100 h-100" style={{fontSize: "0.8rem"}}>
                <div className="d-flex flex-column align-items-center w-100 h-100 overflow-auto">
                    <PageTitle title="Moje zgłoszenia" />
                    <ButtonWithState label={"Nowe"} state={newFormAState} className={"btn btn-primary m-2 align-self-end"} to={"/Form"}/>
                    <MyApplicationsList />
                </div>
            </div>
        </Page>
    )

}
export default MyApplicationsPage