import React, {useState} from 'react';
import Page from "../Tools/Page";
import {Link} from "react-router-dom";
import FormA0 from "../Forms/FormA0";


type Props = {
    className?: string
}


function SavedFormPage(props: Props) {
    const [button, saveButton] = useState(true)
    return (
        <>
            {button &&
            <Page className={props.className + " d-flex justify-content-center bg-white"}>
                <div className="d-flex flex-column pb-1 m-2 center align-self-start justify-content-center w-100">
                    <p>Wybierz formularz</p>
                    <div className={"btn btn-primary"} onClick={()=>saveButton(!button) }>ZAPISANY FORMULARZ</div>

                </div>
            </Page>
            }
            {!button &&
            <FormA0 loadValues={JSON.parse(localStorage.getItem('formData'))}/>}
        </>
    )
}


export default SavedFormPage;