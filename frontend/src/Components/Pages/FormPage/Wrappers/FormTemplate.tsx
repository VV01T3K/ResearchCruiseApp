import React, {useEffect} from 'react';
import Page from "../../Page";
import {useNavigate} from "react-router-dom";
import useCustomEvent from "../../../Tools/useCustomEvent";
import Api from "../../../Tools/Api";
import {FormAValue, FormAValues} from "../Forms/FormA";
import {UseFormReturn} from "react-hook-form";


export type FormValues =
    FormAValues // | FormBValues | FormCValues

type FormValue =
    FormAValue // | FormBValue | FormCValue

export type SavedFormData = {
    type: string,
    id: number,
    date: string,
    percentComplete: number,
    data: FormValues
}

type Props = {
    children?: React.ReactElement<any, string | React.JSXElementConstructor<HTMLElement>>[]
    form: UseFormReturn,
    loadValues?: FormValues,
    type: string,
    readonly?:boolean
}


function FormTemplate(props: Props) {
    const { dispatchEvent } = useCustomEvent('busy');

    const navigate = useNavigate();
    const saveValues = () => {
        dispatchEvent("Trwa zapisywanie")
        const savedFormsDataString = localStorage.getItem('formData');
        let savedFormsData: SavedFormData[] = [];
        // Jeśli nie ma jeszcze żadnych danych w localStorage, utwórz nową tablicę
        if (savedFormsDataString) {
            savedFormsData = JSON.parse(savedFormsDataString);
        }

        // Dodaj nowy formularz do tablicy
        const newSavedForm: SavedFormData = {
            type: props.type,
            id: Math.random(),
            date: new Date().toISOString(),
            percentComplete: ((24 - Object.entries(props.form.formState.errors).length)/24*100).toFixed(0) ?? 100,
            data: props.form.getValues() as FormValues
        }
        savedFormsData.push(newSavedForm);

        // Zapisz zaktualizowane dane w localStorage
        localStorage.setItem('formData', JSON.stringify(savedFormsData));

        setTimeout(()=>{
            navigate("/savedForms")
            dispatchEvent(null)
        },5000);
    };
    const handlePrint = () => {
        var header_str = '<html><head><title>' + document.title  + '</title></head><body>';
        var footer_str = '</body></html>';
        var new_str = document.getElementById("form")!.innerHTML;
        var old_str = document.body.innerHTML;
        document.body.innerHTML = header_str + new_str + footer_str;
        window.print();
        document.body.innerHTML = old_str;

    }

    const handleSave = () => {

        const blob = new Blob([JSON.stringify(props.form.getValues(),  null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        return url
    }
    const fileName = () => {
        const currentDate = new Date();
        const day = currentDate.getDate();
        const month = currentDate.getMonth() + 1; // Adding 1 because months are zero-indexed
        const year = currentDate.getFullYear();
        return `Formularz_${props.type}_${day}.${month}.${year}`;
    }

    useEffect(
        () => {
            if (props.loadValues) {
                Object
                    .entries(props.loadValues)
                    .forEach(([key, value]: [string, FormValue]) => {
                        props.form.setValue(
                            key,
                            value,
                            {
                                shouldDirty: true,
                                shouldValidate: true,
                                shouldTouch: true
                            }
                        )
                    })
            }
        },
        [props.loadValues]
    );


    const handleSubmit = (data) => {
        console.log(props.form.getValues()); console.log(props.form.formState.errors); console.log(props.form.formState.touchedFields)
        dispatchEvent("Trwa wysyłanie")

        // const savedFormsDataString = localStorage.getItem('sentFormData');
        // let savedFormsData: SavedFormData[] = [];
        // // Jeśli nie ma jeszcze żadnych danych w localStorage, utwórz nową tablicę
        // if (savedFormsDataString) {
        //     savedFormsData = JSON.parse(savedFormsDataString);
        // }
        //
        // // Dodaj nowy formularz do tablicy
        // const newSavedForm: SavedFormData = {
        //     type: props.type,
        //     id: Math.random(),
        //     date: new Date().toISOString(),
        //     percentComplete: ((24 - Object.entries(props.form.formState.errors).length)/24*100).toFixed(0) ?? 100,
        //     data: props.form.getValues() as FormValues
        // }
        // savedFormsData.push(newSavedForm);
        //
        // // Zapisz zaktualizowane dane w localStorage
        // localStorage.setItem('sentFormData', JSON.stringify(savedFormsData));
        Api.post('/formsA/'+props.type, data).catch((err)=>null).then(()=>{setTimeout(()=>{dispatchEvent(null); navigate("/ViewForms")},1000)
    })}

    return (
        <>
            <Page className="justify-content-center col-12 col-xl-9 bg-white" >
                <div className="d-flex flex-column w-100 h-100" style={{fontSize: "0.8rem"}} id={"form"}>
                    <div className="d-flex flex-column align-items-center w-100 h-100 overflow-auto" >
                        {props.children}
                    </div>
                    <div className={`d-flex flex-row justify-content-center border-top border-black w-100 bg-white`} style={{zIndex:9999}}>
                        {!props.readonly &&
                            <>
                                <div className="d-flex col-6 text-center p-2 justify-content-center">
                                    <button onClick={props.form.handleSubmit(saveValues,saveValues)} className="btn btn-primary w-100" style={{fontSize:"inherit"}}>Zapisz</button>
                                </div>
                                <div className="d-flex col-6 text-center p-2 justify-content-center" >
                                    <button onClick={props.form.handleSubmit(handleSubmit)} className="btn btn-primary w-100" style={{fontSize:"inherit"}}>Wyślij</button>
                                </div>
                            </>
                        }
                        {props.readonly &&
                            <>
                                <div className="d-flex col-6 text-center p-2 justify-content-center">
                                    <button onClick={handlePrint} className="btn btn-primary w-100" style={{fontSize:"inherit"}}>Drukuj</button>
                                </div>
                                <div className="d-flex col-6 text-center p-2 justify-content-center" >
                                    <a download={fileName()} href={handleSave()} className="btn btn-primary w-100" style={{fontSize:"inherit"}}>Pobierz</a>
                                </div>
                            </>
                        }
                    </div>
                </div>
            </Page>

        </>
    )
}


export default FormTemplate