import React, {useState} from 'react';
import Page from "../Tools/Page";
import {Link} from "react-router-dom";
import FormA0 from "../Forms/FormA0";
import FormC0 from "../Forms/FormC0";
import FormB0 from "../Forms/FormB0";


type Props = {
    className?: string
}


function NewFormPage(props: Props) {
    const [selectedForm, setSelectedForm] = useState<null | "A" | "B" | "C">(null)
    return (
        <>
            {!selectedForm &&
                <Page className={props.className + " d-flex p-3 justify-content-center bg-white"}>
                    <div className="d-flex flex-column pb-1 m-2 center align-self-start justify-content-center w-100">
                        <h1 style={{fontSize: "2rem"}}>Wybierz formularz</h1>
                        <div className={"btn btn-primary m-2"} onClick={() => setSelectedForm("A")}>Formularz A</div>
                        <div className={"btn btn-primary m-2"} onClick={() => setSelectedForm("B")}>Formularz B</div>
                        <div className={"btn btn-primary m-2"} onClick={() => setSelectedForm("C")}>Formularz C</div>

                    </div>
                </Page>
            }
            {selectedForm == 'A' &&
                <FormA0/>}
            {selectedForm == 'B' &&
                <FormB0/>}
            {selectedForm == 'C' &&
                <FormC0/>}
        </>
    )
}


export default NewFormPage;