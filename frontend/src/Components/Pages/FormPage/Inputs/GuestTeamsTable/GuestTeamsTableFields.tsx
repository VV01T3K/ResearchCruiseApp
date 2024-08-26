import {KeyContext} from "../../Wrappers/FieldTableWrapper";
import {IntField, TextField} from "../CellFields";
import React from "react";

export const InstitutionField = () =>
    (
        <KeyContext.Provider value={"institution"}>
            <div className={"task-field-input"}>
                <label className={"table-field-input-label"}>
                    Instytucja
                </label>
                <TextField/>
            </div>
        </KeyContext.Provider>
    )

export const NoOfPersonsField = () =>
    (
        <KeyContext.Provider value={"noOfPersons"}>
            <div className={"task-field-input"}>
                <label className={"table-field-input-label"}>
                    Liczba osób
                </label>
                <IntField/>
            </div>
        </KeyContext.Provider>
    )