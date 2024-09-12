import React from "react";
import {CruiseManagerSection} from "../Forms/FormA/FormASections/CruiseManagerSection";
import {TimeSection} from "../Forms/FormA/FormASections/TimeSection";
import {SectionProps} from "./FormSection";
import {PermissionsSection} from "../Forms/FormA/FormASections/PermissionsSection";
import {ResearchAreaSection} from "../Forms/FormA/FormASections/ResearchAreaSection";
import {GoalSection} from "../Forms/FormA/FormASections/GoalSection";
import {TasksSection} from "../Forms/FormA/FormASections/TasksSection";
import {ContractSection} from "../Forms/FormA/FormASections/ContractSection";
import {ResearchTeamsSection} from "../Forms/FormA/FormASections/ResearchTeamsSection";
import {PublicationAndThesesSection} from "../Forms/FormA/FormASections/PublicationsSection";
import {SpubTasksSection} from "../Forms/FormA/FormASections/SpubTasksSection";

export type FormSectionType = {
    Content:(props: SectionProps) => React.JSX.Element, id:string, shortTitle:string, longTitle:string, sectionFieldNames:{[key:string]:string}}
export function SectionIdFromTitle(title:String){
    return "section_" + title.replace(/[^A-Za-z]/g, '');
}


