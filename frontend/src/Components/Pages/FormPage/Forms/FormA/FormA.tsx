import React from "react";
import FormTemplate from "../../Wrappers/FormTemplate";
import {CruiseManagerSection} from "./FormASections/CruiseManagerSection";
import {TimeSection} from "./FormASections/TimeSection";
import {PermissionsSection} from "./FormASections/PermissionsSection";
import {ResearchAreaSection} from "./FormASections/ResearchAreaSection";
import {GoalSection} from "./FormASections/GoalSection";
import {TasksSection} from "./FormASections/TasksSection";
import {ContractSection} from "./FormASections/ContractSection";
import {ResearchTeamsSection} from "./FormASections/ResearchTeamsSection";
import {PublicationAndThesesSection} from "./FormASections/PublicationsSection";
import {SpubTasksSection} from "./FormASections/SpubTasksSection";

const FormASections = () => [
    CruiseManagerSection(),
    TimeSection(),
    PermissionsSection(),
    ResearchAreaSection(),
    GoalSection(),
    TasksSection(),
    ContractSection(),
    ResearchTeamsSection(),
    PublicationAndThesesSection(),
    SpubTasksSection()
]

function FormA(){
    const sections = FormASections()
    return (
        <FormTemplate sections={sections} type='A'/>
    )
}


export default FormA