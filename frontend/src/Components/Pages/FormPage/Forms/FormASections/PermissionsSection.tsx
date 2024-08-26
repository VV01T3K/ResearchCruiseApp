import TextArea from "../../Inputs/TextArea";
import FormRadio from "../../Inputs/FormRadio";
import FormSection, {SectionProps} from "../../Wrappers/FormSection";
import React, {useContext, useEffect, useState} from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../Wrappers/FormASections";
import {FormContext} from "../../Wrappers/FormTemplate";

const permissionsSectionFieldNames = {
    permissionsRequired:"permissionsRequired",
    permissions:"permissions",
}

const PermissionsRequredField = () => {
    return (
        <FormRadio className="two-fields-beside-md"
                   fieldLabel="Czy do badań prowadzonych podczas rejsu są potrzebne dodatkowe pozwolenia?"
                   fieldName={permissionsSectionFieldNames.permissionsRequired}
                   initValues={["tak", "nie"]}
        />
    )
}
export const FormHelpers = () => {
    const formContext = useContext(FormContext)
    const ResetFieldValueIfExist = (fieldName:string) => {
        if(formContext?.getValues(fieldName))
            formContext?.resetField(fieldName)
    }
    const ClearFieldErrorIfExist = (fieldName:string) => {
        if(formContext?.formState?.errors[fieldName])
            formContext!.clearErrors(fieldName)

    }
    return {ResetFieldValueIfExist, ClearFieldErrorIfExist}
}
const PermissionsField = () => {
    const formContext = useContext(FormContext)
    const {ResetFieldValueIfExist, ClearFieldErrorIfExist} = FormHelpers()

    const [disabled, setDisabled] = useState(false)

    useEffect(() => {
        const lastFieldInShipUsageSelected = formContext!.initValues?.shipUsages?.length &&
            formContext!.getValues(permissionsSectionFieldNames.permissionsRequired) == 0
        const handleDisable = () => {
                setDisabled(true)
                ResetFieldValueIfExist(permissionsSectionFieldNames.permissions)
                ClearFieldErrorIfExist(permissionsSectionFieldNames.permissions)
        }

        if(!disabled && !lastFieldInShipUsageSelected) {
            handleDisable()
        }
        else if(disabled && lastFieldInShipUsageSelected)
            setDisabled(false)

    }, []);

    return(
        <TextArea className="two-fields-beside-md"
                  fieldLabel="Jakie?"
                  fieldName={permissionsSectionFieldNames.permissions}
                  disabled = {disabled}
                  required={!disabled && "Podaj jakie"}
        />
    )
}


export const PermissionsSection = ():FormSectionType => {
    const shortTitle = "Pozwolenia"
    const longTitle = "Dodatkowe pozwolenia do planowanych podczas rejsu badań"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <PermissionsRequredField/>
            <PermissionsField/>

        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:permissionsSectionFieldNames}
}