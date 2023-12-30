import React, {useState} from 'react';
import CSSModules from 'react-css-modules';
import Style from './FormTemplate.css'
import Page from "../../Tools/Page";

function FormTemplate(props:{children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>[]}){
    const [currentForm, setCurrentForm] = useState<"login"|"register"|"remind">("login")
    return (
        <>
            <Page className={"justify-content-center bg-white"}>
                <div className={"d-flex flex-column w-100"}>
                    <div className={"d-flex flex-column  w-100 overflow-scroll p-5 "}>
                        {props.children}
                    </div>
                    <div className={"d-flex flex-row m-3 "}>
                        <button className={"d-flex col-6 text-center m-2"}>Zapisz</button>
                        <button className={"d-flex col-6 text-center m-2 "}>Zapisz i wyślij</button>
                    </div>
                </div>
            </Page>
        </>
    )
}

export default CSSModules(FormTemplate, Style);