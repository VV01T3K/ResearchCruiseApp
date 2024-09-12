import React, {useContext} from "react";
import {FieldValues} from "react-hook-form";
import {FDateFieldOnlyYear, FTextField} from "./CellFormFields";
import {FieldContext, FieldTableWrapper, KeyContext} from "../Wrappers/FieldTableWrapper";
import {BottomMenuWithAddButtonAndHistory, OrdinalNumber, RemoveRowButton} from "./TableParts";
import {FieldProps} from "./FormRadio";
import FieldWrapper from "./FieldWrapper";
import {FormContext} from "../Wrappers/FormTemplate";


export type SpubTask = {
    yearFrom: string,
    yearTo: string,
    name: string
}


const spubTaskDefaultValue = {
    yearFrom: "",
    yearTo: "",
    name: ""
}

export const NameField = () => {
    return(
        <KeyContext.Provider value={"name"}>
            <div className={"task-field-input"}>
                <label className={"table-field-input-label"}>
                    Nazwa zadania
                </label>
                <FTextField/>
            </div>
        </KeyContext.Provider>
    )}

export const StartYearField = () => {
    return(
        <KeyContext.Provider value={"yearFrom"}>
            <div className={"task-field-input"}>
                <label className={"table-field-input-label"}>
                    Rok rozpoczęcia
                </label>
                <FDateFieldOnlyYear/>
            </div>
        </KeyContext.Provider>
    )}

export const EndYearField = () => {
    return(
        <KeyContext.Provider value={"yearTo"}>
            <div className={"task-field-input"}>
                <label className={"table-field-input-label"}>
                    Rok zakończenia
                </label>
                <FDateFieldOnlyYear/>
            </div>
        </KeyContext.Provider>
    )}

const ThesesTableContent = () =>
    [
        ()=>(<OrdinalNumber label={"Zadanie"}/>),
        StartYearField,
        EndYearField,
        NameField,
        RemoveRowButton,
    ]

type ThesesTableProps = FieldProps &
    {historicalSpubTasks?: SpubTask[]}

const SpubTaskRowLabel = (row:SpubTask) =>
    `${row.name} (${row.yearFrom}–${row.yearTo})`




export const SpubTaskTable = (props: ThesesTableProps) => {


    const SpubTaskRender = ({field}:FieldValues)=> {

        const formContext = useContext(FormContext)

        const selectOptions = props.historicalSpubTasks?.map((row: SpubTask) =>
            ({label: SpubTaskRowLabel(row), value: row})) ?? []


        const mdColWidths = [5,15,15,60, 5]
        const mdColTitles = ["Lp.", "Rok rozpoczęcia", "Rok zakończenia", "Nazwa zadania", ""]
        const colTitle = "Zadania"
        const bottomMenu =
            <BottomMenuWithAddButtonAndHistory newOption={spubTaskDefaultValue} historicalOptions={selectOptions}/>
        const emptyText = "Nie dodano żadnego zadania"
        const {Render} = FieldTableWrapper(colTitle, mdColWidths, mdColTitles,ThesesTableContent,
            bottomMenu, emptyText, formContext!.getValues(props.fieldName))


        return(
            <FieldContext.Provider value={field}>
                <Render/>
            </FieldContext.Provider>
        )
    }


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
            validate: {
                notEmptyArray: (value:FieldValues) => {
                    if (value.some((row:SpubTask) => {
                        return Object.values(row).some(field => {
                                return !field
                            }
                        )
                    }))
                        return"Wypełnij wszystkie pola"
                },
                rightYearPeriod:(value:FieldValues) => {
                    if (value.some((row:SpubTask) => row.yearTo<row.yearFrom))
                        return "Rok zakończenia przed rokiem rozpoczęcia"
                }
            }
        },
        render: SpubTaskRender
    }

    return (
        <FieldWrapper {...fieldProps}/>
    )
}