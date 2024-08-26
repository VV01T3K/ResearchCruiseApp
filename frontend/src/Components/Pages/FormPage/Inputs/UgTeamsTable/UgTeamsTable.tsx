import React, {createContext, useContext} from "react";
import {FieldValues} from "react-hook-form";
import {FormContext} from "../../Wrappers/FormTemplate";
import {BottomMenuSingleSelect, CellTools, OrdinalNumber, RemoveRowButton} from "../TableParts";
import {FieldContext, FieldTableWrapper, KeyContext} from "../../Wrappers/FieldTableWrapper";
import FieldWrapper from "../FieldWrapper";
import {FormField} from "../FormYearSelect";
import {IntField} from "../CellFields";


export type UgTeam = {
    unit: number,
    noOfEmployees: string,
    noOfStudents: string
}


type Props = FormField & {
    initValues?: string[]
}

export const NoOfStudentsField = () =>
    (
        <KeyContext.Provider value={"noOfStudents"}>
            <div className={"task-field-input"}>
                <label className={"table-field-input-label"}>
                    Liczba studentów
                </label>
                <IntField/>
            </div>
        </KeyContext.Provider>
    )

export const NoOfEmployeesField = () =>
    (
        <KeyContext.Provider value={"noOfEmployees"}>
            <div className={"task-field-input"}>
                <label className={"table-field-input-label"}>
                    Liczba pracowników
                </label>
                <IntField/>
            </div>
        </KeyContext.Provider>
    )

const ugTeamsTableContent = () =>
    [
        ()=>(<OrdinalNumber label={"Jednostka"}/>),
        UnitField,
        NoOfEmployeesField,
        NoOfStudentsField,
        RemoveRowButton,
    ]

export const UnitField = () => {
    return  (
        <KeyContext.Provider value={"unit"}>
            <div className={"task-field-input"}>
                <label className={"table-field-input-label"}>
                    Jednostka
                </label>
                <StringValueField/>
            </div>
        </KeyContext.Provider>)
}

export const StringValueField = () => {
    const initContext = useContext(InitContext)
    const {cellValue} = CellTools()

    return(
        <>
            {initContext && initContext[cellValue]}
        </>
    )
}

const InitContext = createContext<any>(null)

function UgTeamsTable(props: Props) {


    const formContext = useContext(FormContext)

    const selectOptions =  props.initValues?.map((ugTeam, index)=>
            ({label:ugTeam, value: {unit:index, noOfEmployees: 0, noOfStudents: 0}})) ?? []


    const mdColWidths = [10,32, 24, 24, 10]
    const mdColTitles = ["Lp.", "Jednostka", "Liczba pracowników", "Liczba studentów", ""]
    const colTitle = "Jednostki"
    const bottomMenu =
        <BottomMenuSingleSelect options={selectOptions}/>
    const emptyText = "Nie dodano żadnej jednostki"
    const {Render} = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, ugTeamsTableContent,
        bottomMenu, emptyText, formContext!.getValues(props.fieldName))


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: "Pole wymagane",
            validate: {
                notEmptyArray: (value:FieldValues) => {
                    if(value.some((row:UgTeam)=> {
                        return parseInt(row.noOfEmployees) <=0 && parseInt(row.noOfStudents) <= 0
                    }))
                        return"Dodaj przynajmniej jedną osobę z jednostki"
                }
            }
        },
        render: ({field}:FieldValues)=>(
            <FieldContext.Provider value={{field:field, fieldName:props.fieldName}}>
                <InitContext.Provider value={props.initValues}>
                    <Render/>
                </InitContext.Provider>
            </FieldContext.Provider>
        )
    }

    return (
        <FieldWrapper {...fieldProps}/>
    )
}


export default UgTeamsTable