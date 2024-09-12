import FormSection, {SectionProps} from "../../../Wrappers/FormSection";
import React, {useContext} from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../../Wrappers/FormASections";
import {CruiseGoalDescriptionField, CruiseGoalField} from "./GoalSectionFields";

export const goalSectionFieldNames = {
    cruiseGoal:"cruiseGoal",
    cruiseGoalDescription:"cruiseGoalDescription",
}

export const GoalSection = ():FormSectionType => {
    const shortTitle = "Cel"
    const longTitle = "Cel rejsu"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <CruiseGoalField/>
            <CruiseGoalDescriptionField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:goalSectionFieldNames}
}