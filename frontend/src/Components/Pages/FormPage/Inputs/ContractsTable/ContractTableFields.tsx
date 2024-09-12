import {FSelectField, FTextField} from "../CellFormFields";
import React from "react";
import {KeyContext} from "../../Wrappers/FieldTableWrapper";
import {contractCategories, contractCategoriesPL} from "./ContractsTable";
import FilePicker from "./FilePicker";
import FFileDownloader from "../../../../CommonComponents/FFileDownloader";


export const ContractDescriptionField = () =>
    (
        <KeyContext.Provider value={"description"}>
            <div className={"task-field-input"}>
                <label className={"table-field-input-label"}>
                    Opis
                </label>
                <FTextField/>
            </div>
        </KeyContext.Provider>
    )

export const InstitutionField = () =>
    (
        <KeyContext.Provider value={"institutionName"}>
            <div className={"task-field-input"}>
                <label>
                    Nazwa instytucji
                </label>
                <FTextField/>
            </div>
        </KeyContext.Provider>
    )

export const UnitField = () =>
    (
        <KeyContext.Provider value={"institutionUnit"}>
            <div className={"task-field-input"}>
                <label>
                    Jednostka
                </label>
                <FTextField/>
            </div>
        </KeyContext.Provider>
    )

export const LocationField = () =>
    (
        <KeyContext.Provider value={"institutionLocalization"}>
            <div className={"task-field-input"}>
                <label>
                    Lokalizacja instytucji
                </label>
                <FTextField/>
            </div>
        </KeyContext.Provider>
    )

export const CategoryPicker = () => {
    const contractCategoryOptions = contractCategories.map(
        (category,index)=>({label:contractCategoriesPL[index], value:category}))

    return(
    <KeyContext.Provider value={"category"}>
        <div className={"task-field-input"}>
            <label className={"table-field-input-label"}>
                Kategoria
            </label>
            <FSelectField options={contractCategoryOptions}/>
        </div>
    </KeyContext.Provider>
)}

export const UploadField = () => (
    <KeyContext.Provider value={"scan"}>
        <div className={"task-field-input"}>
            <label className={"table-field-input-label"}>
                Skan umowy
            </label>
            <FilePicker/>
        </div>
    </KeyContext.Provider>
)

export const DownloadField = () => (
    <KeyContext.Provider value={"scan"}>
        <div className={"task-field-input"}>
            <label className={"table-field-input-label"}>
                Skan umowy
            </label>
            <FFileDownloader/>
        </div>
    </KeyContext.Provider>
)

export const InstitutionCell = () => (
    <div className={"d-flex flex-column w-100"}>
        <label className={"table-field-input-label"}>Instytucja:</label>
        <InstitutionField/>
        <UnitField/>
        <LocationField/>
    </div>
)

