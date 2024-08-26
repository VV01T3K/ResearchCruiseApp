import React, {useContext} from "react";
import { FieldValues,} from "react-hook-form";
import {registerLocale} from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import '../DateInput.css'
import pl from "date-fns/locale/pl";
registerLocale("pl", pl);
import 'react-dropdown/style.css';
import FieldWrapper from "../FieldWrapper";
import {FormContext} from "../../Wrappers/FormTemplate";
import {FieldContext,
    FieldTableWrapper,
    KeyContext,
} from "../../Wrappers/FieldTableWrapper";
import {FieldProps} from "../FormRadio";
import {
    AuthorField, DidacticsDescriptionField, DateField,
    EndDateField,
    FinancingAmountField,
    InstitutionField,
    StartDateField, TaskDescriptionField,
    TitleField
} from "./TaskInputFields";
import {BottomMenuWithHistory, CellTools, OrdinalNumber, RemoveRowButton} from "../TableParts";

type ReseachTask = {
    type: number,
    title?: string,
    author?: string,
    institution?: string,
    date?: string,
    startDate?:string,
    endDate?:string,
    financingAmount?:string,
    description?:string
}

export const taskTypes = [
    'Praca licencjacka',
    'Praca magisterska',
    'Praca doktorska',
    "Przygotowanie projektu naukowego",
    "Realizacja projektu krajowego (NCN, NCBiR, itp.)",
    "Realizacja projektu zagranicznego (ERC, Programy ramowe UE, fundusze norweskie, itp)",
    "Realizacja projektu wewnętrznego UG",
    "Realizacja innego projektu naukowego",
    "Realizacja projektu komercyjnego",
    "Dydaktyka",
    "Realizacja własnego zadania badawczego",
    "Inne zadanie",
]

const taskTypesDefaultValues: ReseachTask[] = [
    { type:0, author: "", title: "" },
    { type:1,  author: "", title: ""},
    { type:2,  author: "", title: ""},
    { type:3,  title: "", date: "", institution: "" },
    { type:4,  title: "", financingAmount: "0.00", startDate: "", endDate: "", },
    { type:5,  title: "", financingAmount: "0.00", startDate: "", endDate: "" },
    { type:6,  title: "", financingAmount: "0.00", startDate: "", endDate: "" },
    { type:7,  title: "", financingAmount: "0.00", startDate: "", endDate: "" },
    { type:8,  title: "", financingAmount: "0.00", startDate: "", endDate: "" },
    { type:9,  description: "" },
    { type:10,  title: "", financingAmount: "0.00",startDate: "", endDate: "",  },
    { type:11,  description: "" },
]
const taskTypeOptions = () => {
    return taskTypes.map((taskLabel, index) =>
        ({label:taskLabel, value:taskTypesDefaultValues[index]}))
}

const FieldForKey = () => {
    const {rowValue} = CellTools()
    const keyContext = useContext(KeyContext)
    switch (keyContext) {
        case "author":
            return <AuthorField/>
        case "title":
            return <TitleField/>
        case "institution":
            return  <InstitutionField/>
        case "date":
            return  <DateField/>
        case "startDate":
            return <StartDateField/>
        case "endDate":
            return  <EndDateField/>
        case "financingAmount":
            return <FinancingAmountField/>
        case "description":
            if(rowValue.type == 9)
                return <DidacticsDescriptionField/>
            else if(rowValue.type == 11)
                return <TaskDescriptionField/>
            else
                return <></>
        default:
            return (<></>)
        }

    }

const FieldsCell = () => {
    const {rowValue} = CellTools()
    return(
        <div className="d-flex flex-wrap flex-row justify-content-center w-100">
            {Object.keys(taskTypesDefaultValues[rowValue.type]).map((key, index)=>
                (<KeyContext.Provider value={key} key={index}>
                        {key!="type" && <FieldForKey/> }
                </KeyContext.Provider>)
            )}
        </div>
    )
}


const TaskTypeLabel = () => {
    const {rowValue} = CellTools()
    return(
        <>{taskTypes[rowValue.type]}</>
    )
}




const taskTableContent = () =>
    [
        ()=>(<OrdinalNumber label={"Zadanie"}/>),
        TaskTypeLabel,
        FieldsCell,
        RemoveRowButton,
    ]

type TaskTableProps = FieldProps &
    {historicalTasks?: ReseachTask[]}

const dateOptions = {month: '2-digit', year: 'numeric'}

const TaskRowLabel = (row:ReseachTask) => (row.author ? ("Autor: " + row.author + ", ") : "")
    + (row.title ? ("Tytuł: " + row.title + ", ") : "")
    + (row.institution ? ("Instytucja: " + row.institution + ", ") : "")
    + (row.date ? ("Data: " + new Date(row.date).toLocaleDateString('pl-PL') + ", ") : "")
    + (row.startDate ? ("od: " + new Date(row.startDate).toLocaleDateString('pl-PL', dateOptions) + ", ") : "")
    + (row.endDate ? ("do: " + new Date(row.endDate).toLocaleDateString('pl-PL', dateOptions) + ", ") : "")
    + (row.financingAmount ? ("Kwota: " + row.financingAmount + " zł, ") : "")
    + (row.description ? ("Opis: " + row.description + ", ") : "")



export const TasksTable = (props: TaskTableProps) => {

    const formContext = useContext(FormContext)

    const FilteredHistoricalTasks = (index:number) =>
        props.historicalTasks?.filter((row) => row.type == index)
        .map((row: ReseachTask) =>
            ({label: TaskRowLabel(row), value: row})) ?? []

    const selectOptions = () => {
        return taskTypes.map((taskType, index)=>
            ({label:taskType, options: FilteredHistoricalTasks(index)})) ?? []
    }


    const mdColWidths = [5,20,70,5]
    const mdColTitles = ["Lp.", "Zadanie", "Szczegóły", ""]
    const colTitle = "Zadania"
    const bottomMenu =
        <BottomMenuWithHistory newOptions={taskTypeOptions()} historicalOptions={selectOptions()}/>
    const emptyText = "Nie dodano żadnego zadania"
    const {Render} = FieldTableWrapper(colTitle, mdColWidths, mdColTitles,taskTableContent,
        bottomMenu, emptyText, formContext!.getValues(props.fieldName))


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: "Pole wymagane",
            validate: {
                notEmptyArray: (value:FieldValues) => {
                    if (value.some((row:ReseachTask) => {
                        return Object.keys(taskTypesDefaultValues[row.type]).some(key => {
                            return key=="type" ? false : row[key]=="" || row[key]==undefined
                        });
                    }))
                        return"Wypełnij wszystkie pola"
                }
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
