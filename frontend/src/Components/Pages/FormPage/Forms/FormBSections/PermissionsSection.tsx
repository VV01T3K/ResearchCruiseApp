import {SectionWrapper} from "../../Wrappers/FormASections";
import React from "react";

export const permissionsSectionFieldNames = {
    permissions:"permissions",
}


export const PermissionsSection = () => SectionWrapper(
    {
        shortTitle: "Pozwolenia",
        longTitle: "Dodatkowe pozwolenia do planowanych podczas rejsu badań",
        sectionFieldNames:permissionsSectionFieldNames,
        children:
            <>

            </>
    }
)