import BusyEvent from "../CommonComponents/BusyEvent";
import Page from "./Page";
import React from "react";

const WaitingPage = () => {
    const {isBusy} = BusyEvent()
    return(
        <Page className={`waiting-page`}>
            <div className={"waiting-page-content"}>
                <div className={"h1"}>{isBusy}</div>
                <div className={"waiting-page-load-spinner"}></div>
            </div>
        </Page>
    )
}
export default WaitingPage