import TextArea from "../../Inputs/TextArea";
import FormSection, {SectionProps} from "../../Wrappers/FormSection";
import React, {useContext} from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../Wrappers/FormASections";
import FormRadio from "../../Inputs/FormRadio";
import {FormContext} from "../../Wrappers/FormTemplate";

const goalSectionFieldNames = {
    cruiseGoal:"cruiseGoal",
    cruiseGoalDescription:"cruiseGoalDescription",
}

const CruiseGoalField = () => {
    const formContext = useContext(FormContext)
    return(
        <FormRadio className="two-fields-beside-md"
                            fieldLabel="Cel rejsu"
                            fieldName={goalSectionFieldNames.cruiseGoal}
                            initValues={formContext!.initValues?.cruiseGoals}
        />
    )
}
const CruiseGoalDescriptionField = () => (
    <TextArea className="two-fields-beside-md"
              fieldLabel="Opis"
              fieldName={goalSectionFieldNames.cruiseGoalDescription}
              required="Opisz cel"
    />
)


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