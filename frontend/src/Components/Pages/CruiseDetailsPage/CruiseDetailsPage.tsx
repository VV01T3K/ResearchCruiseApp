import Page from "../Page";
import PageTitle from "../CommonComponents/PageTitle";
import React from "react";

type Props = {

}


export default function CruiseDetailsPage(props: Props) {
    return (
        <Page className="justify-content-center col-12 col-xl-9 bg-white">
            <div className="d-flex flex-column w-100 h-100" style={{fontSize:"0.8rem"}}>
                <PageTitle title="Szczegóły rejsu" />

            </div>
        </Page>
    )
}