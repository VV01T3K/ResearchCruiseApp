import React, {useContext} from "react";
import {SectionWrapper} from "../../FormPage/Wrappers/FormASections";
import {EvaluatedTasksTable} from "../../FormPage/Inputs/TaskTable/EvaluatedTaskTable";
import {FormContext} from "../../FormPage/Wrappers/FormTemplate";

const researchTasksSectionFieldNames = {
    researchTasks:"researchTasksEvaluationsEdits",
}

const TasksField = () => {
    const formContext = useContext(FormContext)
    return(
        <EvaluatedTasksTable className="single-field"
                            fieldLabel=""
                            fieldName={researchTasksSectionFieldNames.researchTasks}
                            evaluatedReseachTasks={formContext!.initValues?.formAResearchTasks}
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
