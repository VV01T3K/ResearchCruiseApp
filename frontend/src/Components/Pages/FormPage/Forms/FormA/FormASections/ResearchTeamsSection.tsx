import React from "react";
import {SectionWrapper} from "../../../Wrappers/FormASections";
import {GuestTeamsField, UgTeamsField} from "./ResearchTeamsSectionFields";

export const researchTeamsSectionFieldNames = {
    ugTeams:"ugTeams",
    guestTeams:"guestTeams",
}

export const ResearchTeamsSection = () => SectionWrapper(
    {
        shortTitle: "Z. badawcze",
        longTitle: "Zespoły badawcze, jakie miałyby uczestniczyć w rejsie",
        sectionFieldNames: researchTeamsSectionFieldNames,
        children:
            <>
                <UgTeamsField/>
                <GuestTeamsField/>
            </>
    }
)