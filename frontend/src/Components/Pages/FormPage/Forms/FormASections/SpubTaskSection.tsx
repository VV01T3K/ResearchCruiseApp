import FormSection, {SectionProps} from "../../Wrappers/FormSection";
import React from "react";
import { FormSectionType, SectionIdFromTitle } from "../../Wrappers/FormASections";
import {SpubTaskTable} from "../../Inputs/SpubTasksTable";

const spubTasksSectionFieldNames = {
    spubTasks:"spubTasks",
}

const SpubTaskField = () => {
    return (
        <SpubTaskTable
            className={"single-field"}
            fieldLabel="Zadania Spub"
            fieldName={spubTasksSectionFieldNames.spubTasks}
            historicalSpubTasks={
            [
                {
                    yearFrom: 2020,
                    yearTo: 2030,
                    name: "Badanie nowych właściwości wodno-tlenowych Morza Bałtyckiego w obszarze Zatoki Gdańskiej"
                },
            {
                yearFrom: 2021,
                yearTo: 2026,
                name: "Badanie właściwości azotowych Morza Bałtyckiego w obszarze Zatoki Puckiej"
            },
            {
                yearFrom: 2022,
                yearTo: 2024,
                name: "Bałtycki pobór zasobów mineralnych na obszarze Polskiej WSE"
            },
                ]}
        />
    )
}

export const SpubTaskSection = (): FormSectionType => {
    const shortTitle = "SPUB"
    const longTitle =
        "Zadania SPUB, z którymi pokrywają się zadania planowane do realizacji na rejsie"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props: SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            <SpubTaskField/>
        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:spubTasksSectionFieldNames}
}