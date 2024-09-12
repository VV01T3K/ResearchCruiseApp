import React, {useContext} from "react";
import {FieldValues} from "react-hook-form";
import {FDateFieldOnlyYear, FTextField} from "./CellFormFields";
import {FieldContext, FieldTableWrapper, KeyContext} from "../Wrappers/FieldTableWrapper";
import {BottomMenuWithAddButtonAndHistory, OrdinalNumber, RemoveRowButton} from "./TableParts";
import {FieldProps} from "./FormRadio";
import FieldWrapper from "./FieldWrapper";
import {FormContext} from "../Wrappers/FormTemplate";
import {DisplayValueContext, DisplayWrapper, pointFieldRules, PointsField} from "./TaskTable/EvaluatedTaskTable";
import {EndYearField, NameField, SpubTask, StartYearField} from "./SpubTasksTable";
import {Contract} from "./ContractsTable/ContractsTable";


type EvaluatedSpubTask = {
    id:string,
    spubTask:SpubTask,
    calculatedPoints:string
}

const ThesesTableContent = () =>
    [
        ()=>(<OrdinalNumber label={"Zadanie"}/>),
        DisplayWrapper(StartYearField),
        DisplayWrapper(EndYearField),
        DisplayWrapper(NameField),
        PointsField,
    ]

type EvaluatedSpubTasksTable = FieldProps & {
    evaluatedSpubTasks:EvaluatedSpubTask[]
}

export const EvaluatedSpubTaskTable = (props: EvaluatedSpubTasksTable) => {

    const mdColWidths = [5,15,15,55, 10]
    const mdColTitles = ["Lp.", "Rok rozpoczęcia", "Rok zakończenia", "Nazwa zadania", "Punkty"]
    const colTitle = "Zadania"
    const emptyText = "Nie dodano żadnego zadania"
    const {Render} = FieldTableWrapper(colTitle, mdColWidths, mdColTitles,ThesesTableContent,
        null, emptyText, props.evaluatedSpubTasks)

    const idAndPoints = props.evaluatedSpubTasks?.map((value) =>
        ({id:value.id, calculatedPoints:value.calculatedPoints}))
    const displayValue = props.evaluatedSpubTasks?.map((value) =>
        ({...value.spubTask}))

    const fieldProps = {
        ...props,
        defaultValue: idAndPoints,
        rules: pointFieldRules,
        render: ({field}:FieldValues)=>(
            <FieldContext.Provider value={field}>
                <DisplayValueContext.Provider value={displayValue}>
                    <Render/>
                </DisplayValueContext.Provider>
            </FieldContext.Provider>
        )
    }

    return (
        <FieldWrapper {...fieldProps}/>
    )
}