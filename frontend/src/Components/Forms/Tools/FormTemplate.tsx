import React, {useState} from 'react';
import Page from "../../Tools/Page";


type Props = {
    children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>[]
    send,
    form,
    loadValues?
}



function FormTemplate(props: Props) {
    const saveValues = (data:any) => {
        // Tu możesz zapisać dane do Local Storage lub innego źródła danych
        localStorage.setItem('formData', JSON.stringify(data));
    };

    React.useEffect(() => {
        if (props.loadValues) {
            Object.entries(props.loadValues).forEach(([key, value]) => {
                props.form.setValue(key, value, {shouldDirty:true, shouldValidate:true, shouldTouch:true});
            });
        }
    }, [props.form.setValue]);

    return (
        <>
            <Page className="justify-content-center col-12 col-xl-9 bg-white">
                <div className="d-flex flex-column w-100" style={{fontSize:"0.8rem"}}>
                    <div className="d-flex flex-column  w-100 overflow-auto ">
                        {props.children}
                    </div>
                    <div className="d-flex flex-row justify-content-center border-top border-black w-100 bg-white" style={{zIndex:9999}}>
                        <div className="d-flex col-6 text-center p-2 justify-content-center">
                            <button onClick={()=>saveValues(props.form.getValues())} className="btn btn-primary w-100" style={{fontSize:"inherit"}}>Zapisz</button>
                        </div>
                        <div className="d-flex col-6 text-center p-2 justify-content-center" >
                            <button onClick={props.send} className="btn btn-primary w-100" style={{fontSize:"inherit"}}>Wyślij</button>
                        </div>
                    </div>
                </div>
            </Page>
        </>
    )
}


export default FormTemplate