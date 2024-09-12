import {TasksTable} from "../../../Inputs/TaskTable/TaskTable";
import React from "react";
import {researchTasksSectionFieldNames} from "./TasksSection";

export const TasksField = () => {
    //const formContext = useContext(FormContext)
    return(
        <TasksTable className="single-field"
                    fieldLabel=""
                    fieldName={researchTasksSectionFieldNames.researchTasks}
                    historicalTasks={[
                        {
                            "type": "5",
                            "title": "3re",
                            "startDate": "Mon Jan 01 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)",
                            "endDate": "Sun Dec 01 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)",
                            "financingAmount": "0.00"
                        },
                        {
                            "type": "11",
                            "description": "rtetretret"
                        },
                        {
                            "type": "3",
                            "title": "fsdfds",
                            "institution": "ffsdff",
                            "date": "Fri Mar 15 2024 00:00:00 GMT+0100 (czas środkowoeuropejski standardowy)"
                        },
                        {
                            "type": "0",
                            "author": "sdfdsf",
                            "title": "dsfdfsd"
                        }
                    ]}
        />
    )
}
