import React, {useState} from 'react';
import Page from "../../Tools/Page";


type Props = {
    children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>[]
    send,
    save,
}


function FormTemplate(props: Props) {
    return (
        <>
            <Page className="justify-content-center bg-white">
                <div className="d-flex flex-column w-100">
                    <div className="d-flex flex-column  w-100 overflow-auto p-2 p-md-2 ">
                        {props.children}
                    </div>
                    <div className="d-flex flex-row justify-content-center border-top border-black w-100 bg-white" style={{zIndex:9999}}>
                        <div className="d-flex col-6 text-center p-2 justify-content-center">
                            <button onClick={props.save} className="btn btn-primary w-100">Zapisz</button>
                        </div>
                        <div className="d-flex col-6 text-center p-2 justify-content-center">
                            <button onClick={props.send} className="btn btn-primary w-100">Wyślij</button>
                        </div>
                    </div>
                </div>
            </Page>
        </>
    )
}


export default FormTemplate