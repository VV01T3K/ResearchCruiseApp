import {SpubTaskTable} from "../../../Inputs/SpubTasksTable";
import React from "react";
import {spubTasksSectionFieldNames} from "./SpubTasksSection";

export const SpubTaskField = () => {
    return (
        <SpubTaskTable
            className={"single-field"}
            fieldName={spubTasksSectionFieldNames.spubTasks}
            fieldLabel={""}
            historicalSpubTasks={
                [
                    {
                        yearFrom: "2020",
                        yearTo: "2030",
                        name: "Badanie nowych właściwości wodno-tlenowych Morza Bałtyckiego w obszarze Zatoki Gdańskiej"
                    },
                    {
                        yearFrom: "2021",
                        yearTo: "2026",
                        name: "Badanie właściwości azotowych Morza Bałtyckiego w obszarze Zatoki Puckiej"
                    },
                    {
                        yearFrom: "2022",
                        yearTo: "2024",
                        name: "Bałtycki pobór zasobów mineralnych na obszarze Polskiej WSE"
                    },
                ]}
        />
    )
}