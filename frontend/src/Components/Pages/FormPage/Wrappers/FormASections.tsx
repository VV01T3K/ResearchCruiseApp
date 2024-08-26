import React from "react";
import {CruiseManagerSection} from "../Forms/FormASections/CruiseManagerSection";
import {TimeSection} from "../Forms/FormASections/TimeSection";
import {SectionProps} from "./FormSection";
import {PermissionsSection} from "../Forms/FormASections/PermissionsSection";
import {ResearchAreaSection} from "../Forms/FormASections/ResearchAreaSection";
import {GoalSection} from "../Forms/FormASections/GoalSection";
import {TaskSection} from "../Forms/FormASections/TaskSection";
import {ContractSection} from "../Forms/FormASections/ContractSection";
import {ResearchTeamsSection} from "../Forms/FormASections/ResearchTeamsSection";
import {PublicationAndThesesSection} from "../Forms/FormASections/PublicationAndThesesSection";
import {SpubTaskSection} from "../Forms/FormASections/SpubTaskSection";

export type FormSectionType = {
    Content:(props: SectionProps) => React.JSX.Element, id:string, shortTitle:string, longTitle:string, sectionFieldNames:{[key:string]:string}}
export function SectionIdFromTitle(title:String){
    return "section_" + title.replace(/[^A-Za-z]/g, '');
}


export default function FormASections(){

    const cruiseManagerSection = CruiseManagerSection()
    const timeSection = TimeSection()
    const permissionsSection = PermissionsSection()
    const researchAreaSection = ResearchAreaSection()
    const cruiseGoalSection = GoalSection()
    const taskSection = TaskSection()
    const contractSection = ContractSection()
    const researchTeamsSection = ResearchTeamsSection()
    const publicationAndThesesSection = PublicationAndThesesSection()
    const spubTaskSection = SpubTaskSection()

    return [cruiseManagerSection, timeSection, permissionsSection,
        researchAreaSection, cruiseGoalSection, taskSection,
        contractSection, researchTeamsSection, publicationAndThesesSection, spubTaskSection]
}