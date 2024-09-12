import React, {useContext} from "react";
import {FormContext} from "../../../Wrappers/FormTemplate";
import FormRadio from "../../../Inputs/FormRadio";
import TextArea from "../../../Inputs/TextArea";
import {goalSectionFieldNames} from "./GoalSection";

export const CruiseGoalField = () => {
    const formContext = useContext(FormContext)
    return(
        <FormRadio className="two-fields-beside-md"
                   fieldLabel="Cel rejsu"
                   fieldName={goalSectionFieldNames.cruiseGoal}
                   initValues={formContext!.initValues?.cruiseGoals}
        />
    )
}
export const CruiseGoalDescriptionField = () => (
    <TextArea className="two-fields-beside-md"
              fieldLabel="Opis"
              fieldName={goalSectionFieldNames.cruiseGoalDescription}
              required="Opisz cel"
    />
)
