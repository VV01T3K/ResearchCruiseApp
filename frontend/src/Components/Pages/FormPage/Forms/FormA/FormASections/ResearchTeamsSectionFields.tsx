import UgTeamsTable from "../../../Inputs/UgTeamsTable/UgTeamsTable";
import {administrationUnits} from "../../../../../../resources/administrationUnits";
import {EMPTY_GUID} from "../../../../CruiseFormPage/CruiseFormPage";
import GuestTeamsTable from "../../../Inputs/GuestTeamsTable/GuestTeamsTable";
import React from "react";
import {researchTeamsSectionFieldNames} from "./ResearchTeamsSection";

export const UgTeamsField = () => {
    //const formContext = useContext(FormContext)

    return(
        <UgTeamsTable
            className="two-fields-beside-md"
            fieldLabel="Uczestnictwo osób z jednostek organizacyjnych UG"
            fieldName={researchTeamsSectionFieldNames.ugTeams}
            initValues={administrationUnits.map((name, index)=>({name:name, id:EMPTY_GUID}))}
        />
    )
}

export const GuestTeamsField = () => {
    //const formContext = useContext(FormContext)
    return(
        <GuestTeamsTable
            className="two-fields-beside-md"
            fieldLabel="Uczestnictwo gości spoza UG"
            fieldName={researchTeamsSectionFieldNames.guestTeams}
            historicalGuestsInstitutions={[
                "Instytucja 1", "Instytucja 2", "Instytucja 3"
            ]}
        />
    )
}
