import React, {useState, useEffect} from 'react';
import Page from "../Tools/Page";
import FormA0 from "../Forms/FormA0";
import useCustomEvent from "../Tools/useCustomEvent";


type Props = {
    className?: string
}



function SavedFormPage(props: Props) {
    const { addEventListener:saveListener } = useCustomEvent('saveSuccessful');

    const [form, setForm] = useState(null)
    useEffect(() => {
        const unsubscribeLogin = saveListener(()=>{setForm(null)
            setSavedData(JSON.parse(localStorage.getItem("formData")))
        });
        return () => {
            unsubscribeLogin();
        };
    }, [saveListener]);

    const [savedData, setSavedData] = useState(JSON.parse(localStorage.getItem("formData")))

    const handleRemove = (form) => {

        var data = JSON.parse(localStorage.getItem('formData'));
        console.log(data)
        console.log(form)
        const data2 = data.filter((item) => item.id != form.id)
        // Zapisz zaktualizowane dane w localStorage
        localStorage.setItem('formData', JSON.stringify(data2));
        setSavedData(data2)
    }

    return (
        <>
            {!form &&
            <Page className={props.className + " d-flex w-75 justify-content-center bg-white"}>
                <div className="d-flex flex-column p-4 center align-self-start justify-content-center w-100">
                    <h1 style={{fontSize: "2rem"}}>Zapisane formularze</h1>
                    <div className={"p-4"}>
                        {savedData.length>0 &&
                    <div>
                        <div className={"bg-primary d-none d-xl-block text-white text-center"}>
                            <div className={"d-flex flex-row"}>
                                <div className={"col-4"}>Typ</div>
                                <div className={"col-3"} >%</div>
                                <div className={"col-3"}>Data</div>
                                <div className={"col-2"}>Akcje</div>

                            </div>
                        </div>
                        <div>
                            {localStorage.getItem("formData") && savedData.map((form, index) =>
                                <div className={"d-flex flex-row flex-wrap border text-center align-items-center"} style={{cursor:"pointer"}}
                                     styleName={{cursor: "pointer"}}>
                                    <div style={{height:"10px"}} className={"col-12 d-xl-none d-flex flex-column  bg-primary"}/>
                                    <div className={"col-12 col-xl-4 d-flex flex-column"}><div className={"h6 d-xl-none"}>typ:</div>{form.type}</div>
                                    <div className={"col-12 col-xl-3 d-flex flex-column"}><div className={"h6 d-xl-none"}>% ukończenia:</div>
                                        {form.type}</div>
                                    <div
                                        className={"col-12 col-xl-3 d-flex flex-column"}><div className={"h6 d-xl-none"}>data:</div>
                                        {new Date(form.date).toLocaleString("pl-PL")}</div>
                                    <div className={"col-12 col-xl-2 d-flex flex-row flex-wrap justify-content-center"}>
                                        <div className={"btn btn-primary col-12 col-xl-6"}  onClick={() => setForm(form)} >+
                                        </div>

                                        <div className={"btn btn-danger col-12 col-xl-6"} onClick={()=>handleRemove(form)}>-
                                        </div>

                                    </div>
                                </div>)}
                        </div>
                    </div>}
                        {!savedData.length && <div className={"text-center"}>brak zapisanych formularzy</div>}
                    </div>

                </div>
            </Page>
            }
            {form && form.type == 'A' &&
                <FormA0 loadValues={form.data}/>
            }
            {form && form.type == 'B' &&
                <FormA0 loadValues={form.data}/>
            }
            {form && form.type == 'C' &&
                <FormA0 loadValues={form.data}/>
            }

        </>
    )
}


export default SavedFormPage;