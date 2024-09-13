import FormRadio from "../../../Inputs/FormRadio";
import React, {useContext, useEffect, useState} from "react";
import {FormContext} from "../../../Wrappers/FormTemplate";
import TextArea from "../../../Inputs/TextArea";
import {permissionsSectionFieldNames} from "./PermissionsSection";
import {FormHelpers} from "../../FormsMisc";
import PermissionsTable from "../../../Inputs/PermissionsTable/PermissionsTable";

// export const PermissionsRequredField = () => {
//     return (
//         <FormRadio className="two-fields-beside-md"
//                    fieldLabel="Czy do badań prowadzonych podczas rejsu są potrzebne dodatkowe pozwolenia?"
//                    fieldName={permissionsSectionFieldNames.permissionsRequired}
//                    initValues={["tak", "nie"]}
//         />
//     )
// }
export const PermissionsField = () => {

    return(
        <PermissionsTable
                  className="single-field"
                  fieldLabel=""
                  fieldName={permissionsSectionFieldNames.permissions}
        />
    )
}