import {SectionWrapper} from "../../Wrappers/FormASections";
import React from "react";


export const goalSectionFieldNames = {
    cruiseGoal:"cruiseGoal",
    cruiseGoalDescription:"cruiseGoalDescription",
}

export const GoalSection = () => SectionWrapper(
    {
        shortTitle: "Cel",
        longTitle: "Cel rejsu",
        sectionFieldNames:goalSectionFieldNames,
        children:
            <>

            </>
    }
)