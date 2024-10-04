import React, {createContext, ReactElement, useEffect, useState} from 'react';
import Page from "../../Page";
import {useForm, UseFormReturn} from "react-hook-form";
import FormTitleWithNavigation, {formType, FormTypeValues} from "../../CommonComponents/FormTitleWithNavigation";
import {FormSectionType} from "./FormASections";
import {BottomOptionBar} from "../../../Tools/FormBottomOptionBar";
import {FormAInitValues} from "../FormTypes";
import Api from "../../../Tools/Api";
import {extendedUseLocation} from "../FormPage";


type Props = {
    type: string,
    readOnly?: boolean,
    sections: FormSectionType[],
    initValues?: FormAInitValues,
    defaultValues?: any,
    BottomOptionBar?: React.JSXElementConstructor<any>
}

export type ExtendedUseFormReturn = UseFormReturn & {
    type: string,
    readOnly?: boolean,
    setReadOnly: (state: boolean) => void,
    sections: FormSectionType[],
    initValues?: FormAInitValues
}


export const FormContext = createContext<ExtendedUseFormReturn | null>(null)
export const ReadOnlyContext = createContext<boolean>(false)
export const FormSections = (props: { sections: FormSectionType[] }) => (
    <div className="form-page-content" id={"form"}>
        {props.sections.map((section: FormSectionType, index) =>
            <section.Content key={index} index={index + 1}/>
        )}
    </div>
)

export const WatchContext = createContext(null)

function FormTemplate(props: Props) {

    const location = extendedUseLocation()


    const defaultGetForm = () => Api.get(
        `/api/CruiseApplications/${location?.state.cruiseApplicationId}/form${location?.state.formType}`
    )
    const getFormForSupervisor  = () => Api.get(
        `/api/CruiseApplications/${location?.state.cruiseApplicationId}
        /formAForSupervisor?supervisorCode=${location?.state.supervisorCode}`
    )

    const getForm = location?.state.supervisorCode ? getFormForSupervisor : defaultGetForm

    const [defaultValues, setDefaultValues] = useState(props.defaultValues ?? undefined)

    useEffect(() => {
        if(location?.state.cruiseApplicationId && location.state.formType && !defaultValues ) {
                getForm().then(response => {
                    setDefaultValues(response?.data)
                    form.reset(response?.data)
                })
        }
    }, []);

    const initEndpoint = (_formType: FormTypeValues) => {
        switch (_formType){
            case formType.A:
                return '/Forms/InitValues/A'
            case formType.ApplicationDetails:
                return `/api/CruiseApplications/${location?.state?.cruiseApplication.id}/evaluation`
        }
    }

    const [formInitValues, setFormInitValues] =
        useState<FormAInitValues | undefined>(undefined)
    useEffect(() => {
        const initValuesPath = initEndpoint(props.type)
        if (!initValuesPath)
            return

        Api
            .get(initValuesPath)
            .then(response => {
                setFormInitValues(response?.data)
                form.reset()
            })
    },[]);

    const form = useForm({
        mode: 'onBlur',
        defaultValues: defaultValues,
        shouldUnregister: false,
        reValidateMode:"onBlur"
    })

    const [readOnly, setReadOnly] = useState(location?.state.readOnly)

    const formContext = {
        resetField: form.resetField,
        clearErrors: form.clearErrors,
        trigger: form.trigger,
        formState: form.formState,
        handleSubmit: form.handleSubmit,
        getValues: form.getValues,
        reset: form.reset,
        control: form.control,
        setValue: form.setValue,
        setError: form.setError,
        defaultValues: defaultValues,
        setReadOnly: setReadOnly,
        type: props.type,
        readOnly: readOnly,
        sections: props.sections,
        initValues: formInitValues
    };

    console.log(formContext!.getValues())



    return (
        <Page className="form-page">
            <FormContext.Provider value={formContext}>
                <ReadOnlyContext.Provider value={formContext.readOnly}>
                    <FormTitleWithNavigation/>
                    <FormSections sections={props.sections}/>
                    {props.BottomOptionBar ? <props.BottomOptionBar/> : <BottomOptionBar/>}
                </ReadOnlyContext.Provider>
            </FormContext.Provider>

        </Page>
    )
}


export default FormTemplate