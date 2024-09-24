import React, {useContext} from "react";
import {FieldValues} from "react-hook-form";
import {SingleValue} from "react-select";
import {BottomMenuWithAddButton, OrdinalNumber, RemoveRowButton} from "../TableParts";
import {FieldContext, FieldTableWrapper} from "../../Wrappers/FieldTableWrapper";
import {FormField} from "../FormYearSelect";
import {FormContext} from "../../Wrappers/FormTemplate";
import FieldWrapper from "../FieldWrapper";
import {notEmptyArray} from "../PublicationsTable/PublicationsTable";
import {DescriptionField, DownloadField, ExecutiveField, UploadField} from "./PermissionsTableFields";
import {ScanType} from "../PermissionsInput/PermissionsInput";
import {fileExists} from "../ContractsTable/ContractsTable";


export type Permission = {
    description: string,
    executive: string,
    scan: ScanType
}

const permissionDefault = {
    description:"",
    executive: "",
}

export const permissionDefaultWithScan = {
    ...permissionDefault,
    scan: {
        name:"",
        content:""
    }}

export type PermissionWithScan = Permission & {
    scan:ScanType
}


type Props = FormField

const guestTeamsTableContent = () => [
        () => (<OrdinalNumber label={"Pozwolenie"}/>),
        DescriptionField,
        ExecutiveField,
        // formContext?.readOnly ? DownloadField : UploadField,
        RemoveRowButton,
    ]

export const FieldContextWrapper = (Render:React.JSXElementConstructor<any>) => ({field}:FieldValues)=>  (
    <FieldContext.Provider value={field}>
        <Render/>
    </FieldContext.Provider>
)

function PermissionsTable(props: Props) {


    const formContext = useContext(FormContext)


    const mdColWidths = [10,40, 40, 10]
    const mdColTitles = ["Lp.", "Treść pozwolenia", "Organ wydający pozwolenie",  ""]
    const colTitle = "Pozwolenia"
    const bottomMenu =
        <BottomMenuWithAddButton newOption={permissionDefault as SingleValue<any>}/>
    const emptyText = "Nie dodano żadnego pozwolenia"
    const {Render} = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, guestTeamsTableContent,
        bottomMenu, emptyText, formContext!.getValues(props.fieldName))


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
            validate: {
                notEmptyArray: notEmptyArray<Permission>,
                // fileExists:fileExists,
            }
        },
        render: FieldContextWrapper(Render)
    }

    return (
        <FieldWrapper {...fieldProps}/>
    )
}


export default PermissionsTable
