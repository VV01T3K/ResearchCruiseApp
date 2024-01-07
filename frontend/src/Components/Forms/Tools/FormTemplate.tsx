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
                    <div className={"d-flex flex-column  w-100 overflow-scroll p-2 p-md-2 "}>
                        {props.children}
                    </div>
                    <div className={"d-flex flex-row justify-content-center  border-top border-black w-100"}>
                        <div className={"d-flex col-6 text-center p-2 justify-content-center"}>
                            <a className={"btn btn-primary w-100"}>Zapisz</a>
                        </div>
                        <div className={"d-flex col-6 text-center p-2 justify-content-center"}>
                            <a className={"btn btn-primary w-100"}>Wyślij</a>
                        </div>
                    </div>
                </div>
            </Page>
        </>
    )
}

export default CSSModules(FormTemplate, Style);