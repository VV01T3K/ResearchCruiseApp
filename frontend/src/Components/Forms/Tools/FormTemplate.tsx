import React, {useState} from 'react';
import CSSModules from 'react-css-modules';
import Style from './FormTemplate.css'
import Page from "../../Tools/Page";

function FormTemplate(props:{children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>[]}){
    const [currentForm, setCurrentForm] = useState<"login"|"register"|"remind">("login")
    return (
        <>
            <Page className={"justify-content-center"}>
                <div className={"d-flex flex-column bg-white w-100 overflow-scroll p-5 "}>
                    {props.children}
                </div>
            </Page>
        </>
)
}

export default CSSModules(FormTemplate, Style);