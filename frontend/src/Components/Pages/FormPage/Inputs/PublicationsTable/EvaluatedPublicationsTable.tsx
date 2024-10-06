import React, {useContext} from "react";
import {FieldValues} from "react-hook-form";
import { BottomMenuWithHistory, OrdinalNumber, RemoveRowButton } from "../TableParts";
import {FieldProps} from "../FormRadio";
import {FieldContext, FieldTableWrapper} from "../../Wrappers/FieldTableWrapper";
import FieldWrapper from "../FieldWrapper";
import {CategoryPicker, InformationsColumn, MinisterialPointsField, YearField} from "./PublicationsTableFields";
import {DisplayValueContext, DisplayWrapper, pointFieldRules, PointsField} from "../TaskTable/EvaluatedTaskTable";
import {Publication} from "./PublicationsTable";


type EvaluatedPublication = {
    id:string,
    publication:Publication,
    points:string
}


const PublicationTableContent = () =>
    [
        ()=>(<OrdinalNumber label={"Publikacja"}/>),
        DisplayWrapper(CategoryPicker),
        DisplayWrapper(InformationsColumn),
        DisplayWrapper(YearField),
        DisplayWrapper(MinisterialPointsField),
        PointsField,
    ]

type PublicationsTableProps = FieldProps &
    {evaluatedPublications?: EvaluatedPublication[]}


export const PublicationsTable = (props: PublicationsTableProps) => {


    const mdColWidths = [5,15,46,10, 14,10]
    const mdColTitles = ["Lp.", "Kategoria", "Informacje", "Rok wydania", "Punkty ministerialne", "Punkty"]
    const colTitle = "Publikacje"
    const emptyText = "Nie dodano żadnej publikacji"
    const {Render} = FieldTableWrapper(colTitle, mdColWidths, mdColTitles,PublicationTableContent,
        null, emptyText, props.evaluatedPublications)


    const idAndPoints = props.evaluatedPublications?.map((value) =>
        ({evaluationId:value.id, newPoints:value.points}))
    const displayValue = props.evaluatedPublications?.map((value) =>
        ({...value.publication}))

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

export default PublicationsTable