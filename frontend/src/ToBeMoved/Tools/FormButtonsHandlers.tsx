import { FieldValues } from 'react-hook-form';
import Api from '../../api/Api';
import { useContext } from 'react';
import { FormContext } from '@contexts/FormContext';
import { ExtendedUseFormReturn } from '../../types/ExtendedUseFormReturn';

export const handleSave = (formContext: ExtendedUseFormReturn) => {
    // const navigate = useNavigate()
    // SetBusyWithMessage("Trwa zapisywanie")
    // Api
    //     .post(`api/forms/${props.type}/Save`, data)
    //     .then(()=> {setTimeout(()=>
    //     {
    //         navigate(Path.SavedApplications)},1000)
    //     })
};
export const handleDownload = (data: FieldValues) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], {
        type: 'application/json',
    });
    return URL.createObjectURL(blob);
};
export const fileName = (formType: string) => {
    const currentDate = new Date();
    const day = currentDate.getDate();
    const month = currentDate.getMonth() + 1; // Adding 1 because months are zero-indexed
    const year = currentDate.getFullYear();
    return `Formularz_${formType}_${day}.${month}.${year}`;
};

export const handlePrint = () => {
    const header_str =
        '<html><head><title>' + document.title + '</title></head><body>';
    const footer_str = '</body></html>';
    const new_str = document.getElementById('form')!.innerHTML;
    const old_str = document.body.innerHTML;
    document.body.innerHTML = header_str + new_str + footer_str;
    window.print();
    document.body.innerHTML = old_str;
};

export const handleSubmit = () => {
    const formContext = useContext(FormContext);

    //SetBusyWithMessage("Trwa wysyłanie")
    Api.post('/formsA/' + formContext!.type, formContext?.getValues());
    // .then(()=> {setTimeout(()=>
    // {
    //         navigate("/ViewForms")},1000)
    // })
};
