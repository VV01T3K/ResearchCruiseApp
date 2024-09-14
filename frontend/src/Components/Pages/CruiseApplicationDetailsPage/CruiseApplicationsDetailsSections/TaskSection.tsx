import React from "react";
import {SectionWrapper} from "../../FormPage/Wrappers/FormASections";
import {EvaluatedTasksTable} from "../../FormPage/Inputs/TaskTable/EvaluatedTaskTable";

const researchTasksSectionFieldNames = {
    researchTasks:"researchTasks",
}

const TasksField = () => {
    //const formContext = useContext(FormContext)
    return(
        <EvaluatedTasksTable className="single-field"
                            fieldLabel=""
                            fieldName={researchTasksSectionFieldNames.researchTasks}
                            evaluatedReseachTasks={[
                                {id:"dasdads",
                                researchTask:{
                                    "type": "1",
                                    "author": "3re",
                                    "title": "Mon Jan 01 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)",
                                    "endDate": "Sun Dec 01 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)",
                                    "financingAmount": "0.00"
                                },
                                    calculatedPoints:"0"
                                },
                            ]}
        />
    )
}


export const TaskSection = () => SectionWrapper(
    {
        shortTitle: "Zadania",
        longTitle: "Zadania do zrealizowania w trakcie rejsu",
        sectionFieldNames:researchTasksSectionFieldNames,
        children: <TasksField/>
    }
)
