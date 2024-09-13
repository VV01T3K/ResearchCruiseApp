import FormSection, {SectionProps} from "../../../Wrappers/FormSection";
import React, {useContext} from "react";
import {
    FormSectionType,
    SectionIdFromTitle
} from "../../../Wrappers/FormASections";
import {PermissionsField, PermissionsRequredField} from "./PermissionsSectionFields";

export const permissionsSectionFieldNames = {
    permissionsRequired:"permissionsRequired",
    permissions:"permissions",
}


export const PermissionsSection = ():FormSectionType => {
    const shortTitle = "Pozwolenia"
    const longTitle = "Dodatkowe pozwolenia do planowanych podczas rejsu badań"
    const id = SectionIdFromTitle(shortTitle)

    const Content = (props:SectionProps) => (
        <FormSection index={props.index} id={id} title={longTitle}>
            {/*<PermissionsRequredField/>*/}
            <PermissionsField/>

        </FormSection>
    )
    return {Content, id, shortTitle, longTitle, sectionFieldNames:permissionsSectionFieldNames}
}