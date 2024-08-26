import React, {useEffect, useState} from "react";
import FormTemplate from "../Wrappers/FormTemplate";
import api from "../../../Tools/Api";
import FormASections, {FormSectionType} from "../Wrappers/FormASections";
import {FormAFields, FormAInitValues} from "../FormTypes";



type Props = {
    loadValues?: FormAFields,
    readonly: boolean
}


function FormA(props: Props){

    const [formInitValues, setFormInitValues]
        = useState<FormAInitValues>()
    useEffect(() => {
        api
            .get('/Forms/InitValues/A')
            .then(response => {
                    setFormInitValues(response.data)
                console.log(response.data)
            })

    },[]);





    const sections:FormSectionType[] = FormASections()
    return (
        <>
        <FormTemplate loadValues={props.loadValues} initValues={formInitValues} sections={sections} readOnly={props.readonly}
            type='A'>
            {sections.map((section:FormSectionType, index) =>
                <section.Content key={index} index={index + 1}/>)}
        </FormTemplate>
        </>
    )
}


export default FormA