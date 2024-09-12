import FormSection, {SectionProps} from "../../../Wrappers/FormSection";
import React from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../../Wrappers/FormASections";
import {TasksField} from "./TasksSectionFields";

export const researchTasksSectionFieldNames = {
    researchTasks:"researchTasks",
}

export const TasksSection = ():FormSectionType => {
    const shortTitle = "Zadania"
    const longTitle = "Zadania do zrealizowania w trakcie rejsu"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <TasksField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:researchTasksSectionFieldNames}
}