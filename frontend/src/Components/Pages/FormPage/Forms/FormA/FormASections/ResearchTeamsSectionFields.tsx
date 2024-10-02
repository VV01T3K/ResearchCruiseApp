import UgTeamsTable from "../../../Inputs/UgTeamsTable/UgTeamsTable";
import {administrationUnits} from "../../../../../../resources/administrationUnits";
import {EMPTY_GUID} from "../../../../CruiseFormPage/CruiseFormPage";
import GuestTeamsTable from "../../../Inputs/GuestTeamsTable/GuestTeamsTable";
import React, {useContext} from "react";
import {researchTeamsSectionFieldNames} from "./ResearchTeamsSection";
import {FormContext} from "../../../Wrappers/FormTemplate";

export const UgTeamsField = () => {
    const formContext = useContext(FormContext)
    return(
        <UgTeamsTable
            className="two-fields-beside-md"
            fieldLabel="Uczestnictwo osób z jednostek organizacyjnych UG"
            fieldName={researchTeamsSectionFieldNames.ugTeams}
            initValues={formContext!.initValues?.ugUnits}
        />
    )
}

export const GuestTeamsField = () => {
    const formContext = useContext(FormContext)
    return(
        <GuestTeamsTable
            className="two-fields-beside-md"
            fieldLabel="Uczestnictwo gości spoza UG"
            fieldName={researchTeamsSectionFieldNames.guestTeams}
            historicalGuestsInstitutions={formContext!.initValues?.historicalGuestInstitutions}
        />
    )
}
