import React, {useContext} from "react";
import {FieldValues} from "react-hook-form";
import { BottomMenuWithHistory, OrdinalNumber, RemoveRowButton } from "../TableParts";
import {FieldProps} from "../FormRadio";
import {FormContext} from "../../Wrappers/FormTemplate";
import {FieldContext, FieldTableWrapper} from "../../Wrappers/FieldTableWrapper";
import FieldWrapper from "../FieldWrapper";
import { CategoryPicker, ContractDescriptionField, DownloadField, InstitutionCell, UploadField } from "./ContractTableFields";
import {notEmptyArray} from "../PublicationsTable/PublicationsTable";


export type Contract = {
    category: string,
    name: string,
    unit: string,
    localization: string
    description: string,
    scan: {
        name: string,
        content: string
    }
}

export const contractCategories = ["domestic","international"]
export const contractCategoriesPL = ["Krajowa","Międzynarodowa"]

const contractDefaultValues = [
    {
    category: "domestic",
    description: "",
    localization: "",
    name: "",
    unit: "",
    scan: {
        name: "",
        content: ""
    }
},
    {
        category: "international",
        description: "",
        localization: "",
        name: "",
        unit: "",
        scan: {
            name: "",
            content: ""
        }
    }

]

export const contractOptions = contractCategoriesPL.map((taskLabel, index) =>
        ({label:taskLabel, value:contractDefaultValues[index]}))

const ContractTableContent = () => {
    const formContext = useContext(FormContext)
    const content = [
        ()=>(<OrdinalNumber label={"Umowa"}/>),
        CategoryPicker,
        InstitutionCell,
        ContractDescriptionField,
        formContext?.readOnly ? DownloadField: UploadField,
        RemoveRowButton,
    ]
    return content
}

type ContractTableProps = FieldProps &
    {historicalContracts?: Contract[]}

const ContractRowLabel = (row:Contract) =>
    `${row.name}, ${row.unit}, ${row.localization}: ${row.description}`

export const ContractTable = (props: ContractTableProps) => {

    const formContext = useContext(FormContext)

    const FilteredHistoricalContracts = (category:string) =>
        props.historicalContracts?.filter((row) => row.category == category)
            .map((row: Contract) =>
                ({label: ContractRowLabel(row), value: row})) ?? []

    const selectOptions =  contractCategories.map((contractCategory, index)=>
            ({label:contractCategoriesPL[index], options: FilteredHistoricalContracts(contractCategory)})) ?? []



    const mdColWidths = [5,20,24,26, 20,5]
    const mdColTitles = ["Lp.", "Kategoria", "Instytucja", "Opis", "Skan"]
    const colTitle = "Umowy"
    const bottomMenu =
        <BottomMenuWithHistory newOptions={contractOptions} historicalOptions={selectOptions}/>
    const emptyText = "Nie dodano żadnej umowy"
    const {Render} = FieldTableWrapper(colTitle, mdColWidths, mdColTitles,ContractTableContent,
        bottomMenu, emptyText, formContext!.getValues(props.fieldName))


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
            validate: { notEmptyArray: notEmptyArray<Contract>,
                fileExists: (value:FieldValues) => value.some((row:Contract)=>
                    !(row.scan.name && row.scan.content)) && "Załącz plik"
            }
        },
        render: ({field}:FieldValues)=>(
            <FieldContext.Provider value={{field:field, fieldName:props.fieldName}}>
                <Render/>
            </FieldContext.Provider>
        )
    }

    return (
        <FieldWrapper {...fieldProps}/>
    )
}


