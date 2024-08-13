import React, {createContext, ReactElement, useEffect} from 'react';
import Page from "../../Page";
import {FormAValue, FormAFields} from "../Forms/FormA";
import {FormProvider, useForm, UseFormReturn} from "react-hook-form";
import FormTitleWithNavigation from "../../CommonComponents/FormTitleWithNavigation";
import {FormSectionType} from "./FormASections";
import {BottomOptionBar} from "../../../Tools/FormBottomOptionBar";
import {FormAInitValues} from "../FormTypes";
import FormSection from "./FormSection";


export type FormValues =
    FormAFields // | FormBValues | FormCValues

export type FormValue =
    FormAValue // | FormBValue | FormCValue

export type SavedFormData = {
    type: string,
    id: number,
    date: string,
    percentComplete: number,
    data: FormValues
}

type Props = {
    children?: React.ReactElement | ReactElement[]
    loadValues?: FormValues,
    type: string,
    readOnly?:boolean,
    sections:FormSectionType[],
    initValues?:FormAInitValues
}

export type ExtendedUseFormReturn = UseFormReturn & {
    type:string,
    readOnly?:boolean,
    sections:FormSectionType[],
    initValues?:FormAInitValues
}


export const FormContext = createContext<ExtendedUseFormReturn | null>(null)

function FormTemplate(props: Props) {
    const form = {...useForm({
        mode: 'onBlur',
        // defaultValues: defaultValues,
        shouldUnregister: false
    }), type:props.type, readOnly:props.readOnly, sections:props.sections, initValues:props.initValues };



    // useEffect(() => {
    //     if (props.loadValues) {
    //         Object
    //             .entries(props.loadValues)
    //             .forEach(([key, value]: [string, FormValue]) => {
    //                 props.form.setValue(
    //                     key,
    //                     value,
    //                     {
    //                         shouldDirty: true,
    //                         shouldValidate: true,
    //                         shouldTouch: true
    //                     }
    //                 )
    //             })
    //     }
    // },[props.loadValues])


    const FormSections = () => (
        <div className="form-page-content">
            {props.sections.map((section:FormSectionType, index) =>
                <section.Content key={index} index={index + 1}/>)}
        </div>
    )


    return (
        <Page className="form-page">
            <FormContext.Provider value={form}>
                <FormTitleWithNavigation/>
               <FormSections/>
                <BottomOptionBar/>
            </FormContext.Provider>
        </Page>
    )
}


export default FormTemplate