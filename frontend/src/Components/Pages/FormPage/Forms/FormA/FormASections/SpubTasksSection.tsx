import React from "react";
import {SectionWrapper} from "../../../Wrappers/FormASections";
import {SpubTaskField} from "./SpubTasksSectionFields";

export const spubTasksSectionFieldNames = {
    spubTasks:"spubTasks",
}

export const SpubTasksSection = () => SectionWrapper(
    {
        shortTitle: "SPUB",
        longTitle: "Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie",
        sectionFieldNames: spubTasksSectionFieldNames,
        children: <SpubTaskField/>
    }
)
