import {SectionWrapper} from "../../Wrappers/FormASections";
import React from "react";
import {GuestTeamsField, UgTeamsField} from "../FormA/FormASections/ResearchTeamsSectionFields";

export const researchTeamsSectionFieldNames = {
    ugTeams:"ugTeams",
    guestTeams:"guestTeams",
}

// TODO: Change crew input

//                     <CrewInput className="col-12"
//                                label="Lista uczestników rejsu"
//                                name="crew"
//                                historicalCrew={[
//                                    {names: "Maksymilian",
//                                        surname: "Panicz" ,
//                                        ID: "184510",
//                                        title: "",
//                                        birthDate: "",
//                                        birthPlace: "",
//                                        expiryDate: "",
//                                        institution: ""
//                                    },
//                                    {names: "Mateusz",
//                                        surname: "Kowalczyk" ,
//                                        ID: "123456",
//                                        title: "",
//                                        birthDate: "",
//                                        birthPlace: "",
//                                        expiryDate: "",
//                                        institution: ""
//                                    },
//                                    {names: "Mateusz",
//                                        surname: "Nowak" ,
//                                        ID: "654321",
//                                        title: "",
//                                        birthDate: "",
//                                        birthPlace: "",
//                                        expiryDate: "",
//                                        institution: ""
//                                    },
//                                    {names: "Michał",
//                                        surname: "Tarnacki" ,
//                                        ID: "987654",
//                                        title: "",
//                                        birthDate: "",
//                                        birthPlace: "",
//                                        expiryDate: "",
//                                        institution: ""
//                                    }
//
//
//
//                                ]}/>

export const ResearchTeamsSection = () => SectionWrapper(
    {
        shortTitle: "Z. badawcze",
        longTitle: "Zespoły badawcze, jakie miałyby uczestniczyć w rejsie",
        sectionFieldNames:researchTeamsSectionFieldNames,
        children:
            <>
                <UgTeamsField/>
                <GuestTeamsField/>
            </>
    }
)