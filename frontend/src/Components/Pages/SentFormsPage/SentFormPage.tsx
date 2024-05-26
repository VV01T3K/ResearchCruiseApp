import React, {useState, useEffect} from 'react';
import Page from "../Page";
import FormA from "../FormPage/Forms/FormA";
import useCustomEvent from "../../Tools/useCustomEvent";
import DisabledByDefaultTextArea from "../FormPage/Inputs/DisabledByDefaultTextArea";
import {FormPageLocationState} from "../FormPage/FormPage";
import {useLocation, useNavigate} from "react-router-dom";


type Props = {
    className?: string
}


// The component only handles the forms saved in the local storage and is a temporary solution
// which will be deleted soon
function SentFormPage(props: Props) {
    const { addEventListener: saveListener } = useCustomEvent('saveSuccessful');

    const [form, setForm] = useState(null)
    useEffect(
        () => {
            const unsubscribeLogin = saveListener(()=>{
                setForm(null)
                setSavedData(JSON.parse(localStorage.getItem("sentsentFormData")))
            });
            return () => {
                unsubscribeLogin();
            };
        },
        [saveListener]
    );

    const [savedData, setSavedData] = useState(JSON.parse(localStorage.getItem("sentFormData")))
    const navigate = useNavigate()

    const navigateToFormPage = (formType: string, loadValues) => {
        const locationState: FormPageLocationState = {
            formType: formType,
            readonly: true,
            loadValues: loadValues
        }
        navigate("/Form", {
            state: locationState
        })
    }
    const [dateAscending, setDateAscending] = useState(false);
    return (
        <>
            {/*{!form &&*/}
            <Page className={props.className + " d-flex w-75 justify-content-center bg-white p-4 "}>
                <div className="d-flex flex-column p-4 center align-self-start justify-content-center w-100 h-100">
                    <h1 style={{fontSize: "2rem"}}>Wysłane formularze</h1>
                    <div className={"p-4 h-100"}>
                        {savedData?.length>0 &&
                        <div className={"d-flex flex-column h-100"}>
                            <div className={"bg-primary d-none d-xl-block text-white text-center"}>
                                <div className={"d-flex flex-row"}>
                                    <div className={"col-1 border-end"}>Typ</div>
                                    <div className={"col-2 border-end"}>Punty</div>
                                    <div className={"col-4 border-end"}>Notatka</div>
                                    <div className={"col-3 border-end"} style={{cursor: "pointer"}} onClick={() => {
                                        setDateAscending(!dateAscending)
                                        const data2 = savedData.sort((a, b) => dateAscending ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date))
                                        // Zapisz zaktualizowane dane w localStorage
                                        setSavedData(data2)
                                    }}>Data
                                    </div>
                                    <div className={"col-2"}>Akcje</div>

                                </div>
                            </div>
                            <div className={"overflow-auto h-100"}>
                                {localStorage.getItem("sentFormData") && savedData?.map((form, index) =>
                                    <div className={"d-flex flex-row flex-wrap border text-center align-items-center"}
                                    >
                                        <div style={{height: "10px"}}
                                             className={"col-12 d-xl-none d-flex flex-column  bg-primary"}/>
                                        <div className={"col-12 col-xl-1 d-flex flex-column"}>
                                            <div className={"h6 d-xl-none"}>typ:</div>
                                            {form.type}</div>
                                        <div className={"col-12 col-xl-2 d-flex flex-column"}>
                                            <div className={"h6 d-xl-none"}>% ukończenia:</div>
                                            {form.percentComplete}</div>
                                        <div className={"col-12 col-xl-4 d-flex flex-column"}>
                                            <div className={"h6 d-xl-none"}>notatka</div>
                                            <DisabledByDefaultTextArea onChange={(e)=>{
                                                setSavedData(prevData =>{
                                                    const newData = prevData.map((form2, index2) =>
                                                        index2 === index ? { ...form2, note: e.target.value } : form2)
                                                    localStorage.setItem('sentFormData', JSON.stringify(newData));
                                                    return newData
                                                    }
                                                )


                                                }} value={form.note}></DisabledByDefaultTextArea></div>

                                        <div
                                            className={"col-12 col-xl-3 d-flex flex-column"}>
                                            <div className={"h6 d-xl-none"}>data:</div>
                                            {new Date(form.date).toLocaleString("pl-PL")}</div>
                                        <div
                                            className={"col-12 col-xl-2 d-flex flex-row flex-wrap justify-content-center"}>
                                            <div className={"btn btn-primary col-12 col-xl-6"}
                                                 onClick={() => navigateToFormPage(form.type, form.data)}>+
                                            </div>

                                        </div>
                                    </div>)}
                            </div>
                        </div>}
                        {!savedData?.length && <div className={"text-center"}>Brak wysłanych formularzy</div>}
                    </div>

                </div>
            </Page>

        </>
    )
}


export default SentFormPage;