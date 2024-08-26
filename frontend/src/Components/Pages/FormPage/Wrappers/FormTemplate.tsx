import React, {createContext, ReactElement} from 'react';
import Page from "../../Page";
import {FormAValue, FormAFields} from "../Forms/FormA";
import {useForm, UseFormReturn} from "react-hook-form";
import FormTitleWithNavigation from "../../CommonComponents/FormTitleWithNavigation";
import {FormSectionType} from "./FormASections";
import {BottomOptionBar} from "../../../Tools/FormBottomOptionBar";
import {FormAInitValues} from "../FormTypes";


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
export const ReadOnlyContext = createContext<boolean>(false)
const FormSections = (props:{sections:FormSectionType[]}) => (
    <div className="form-page-content" id={"form"}>
        {props.sections.map((section:FormSectionType, index) =>
            <section.Content key={index} index={index + 1}/>)}
    </div>
)

function FormTemplate(props: Props) {
    const form = useForm({
        mode: 'onBlur',
        // defaultValues: defaultValues,
        shouldUnregister: false,
        reValidateMode:"onBlur"
    })
    const formContext = {
        resetField:form.resetField,
        clearErrors:form.clearErrors,
        trigger:form.trigger,
        formState:form.formState,
        handleSubmit:form.handleSubmit,
        getValues:form.getValues,
        control:form.control,
        setValue:form.setValue,
        type:props.type, readOnly:props.readOnly, sections:props.sections, initValues:props.initValues };

    return (
        <Page className="form-page">
            <FormContext.Provider value={formContext}>
                <ReadOnlyContext.Provider value={formContext.readOnly}>
                    <FormTitleWithNavigation/>
                   <FormSections sections={props.sections}/>
                    <BottomOptionBar/>
                </ReadOnlyContext.Provider>
            </FormContext.Provider>

        </Page>
    )
}


export default FormTemplate