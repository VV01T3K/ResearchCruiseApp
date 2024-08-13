import {FieldValues} from "react-hook-form";
import Api from "./Api";
import {PathName as Path} from "./PathName";
import {useContext} from "react";
import {ExtendedUseFormReturn, FormContext} from "../Pages/FormPage/Wrappers/FormTemplate";
import {useNavigate} from "react-router-dom";

export const handleSave = (formContext:ExtendedUseFormReturn) => {
    console.log(formContext.getValues())
    // const navigate = useNavigate()
    // SetBusyWithMessage("Trwa zapisywanie")
    // Api
    //     .post(`api/forms/${props.type}/Save`, data)
    //     .then(()=> {setTimeout(()=>
    //     {
    //         navigate(Path.SavedApplications)},1000)
    //     })
}
export const handleDownload = (data:FieldValues) => {
    const blob = new Blob([JSON.stringify(data,  null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    return url
}
export const fileName = (formType:string) => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Adding 1 because months are zero-indexed
    const year = currentDate.getFullYear();
    return `Formularz_${formType}_${day}.${month}.${year}`;
}

export const handlePrint = () => {
    var header_str = '<html><head><title>' + document.title  + '</title></head><body>';
    var footer_str = '</body></html>';
    var new_str = document.getElementById("form")!.innerHTML;
    var old_str = document.body.innerHTML;
    document.body.innerHTML = header_str + new_str + footer_str;
    window.print();
    document.body.innerHTML = old_str;

}

export const handleSubmit = () => {
    const formContext = useContext(FormContext)

    //SetBusyWithMessage("Trwa wysyłanie")
    Api
        .post('/formsA/' + formContext!.type, formContext?.getValues())
    // .then(()=> {setTimeout(()=>
    // {
    //         navigate("/ViewForms")},1000)
    // })
}