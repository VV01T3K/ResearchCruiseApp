import FormRadio from "../../../Inputs/FormRadio";
import React, {useContext, useEffect, useState} from "react";
import {FormContext} from "../../../Wrappers/FormTemplate";
import TextArea from "../../../Inputs/TextArea";
import {permissionsSectionFieldNames} from "./PermissionsSection";
import {FormHelpers} from "../../FormsMisc";

export const PermissionsRequredField = () => {
    return (
        <FormRadio className="two-fields-beside-md"
                   fieldLabel="Czy do badań prowadzonych podczas rejsu są potrzebne dodatkowe pozwolenia?"
                   fieldName={permissionsSectionFieldNames.permissionsRequired}
                   initValues={["tak", "nie"]}
        />
    )
}
export const PermissionsField = () => {
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