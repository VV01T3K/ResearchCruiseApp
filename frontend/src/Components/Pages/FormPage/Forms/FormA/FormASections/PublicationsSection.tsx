import React from "react";
import {SectionWrapper} from "../../../Wrappers/FormASections";
import {PublicationsDescription, PublicationsField} from "./PublicationsSectionFields";

export const publicationsSectionFieldNames = {
    publications:"publications",
}

export const PublicationsSection = () => SectionWrapper(
    {
        shortTitle: "Publikacje",
        longTitle: "Publikacje",
        sectionFieldNames: publicationsSectionFieldNames,
        children:
            <>
                <PublicationsDescription/>
                <PublicationsField/>
            </>
    }
)