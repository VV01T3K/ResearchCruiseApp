import {KeyContext} from "../../Wrappers/FieldTableWrapper";
import {DateFieldOnlyYear, IntField, SelectField, TextField} from "../CellFields";
import React from "react";
import {publicationCategories, publicationCategoriesPL} from "./PublicationsTable";

export const CategoryPicker = () => {
    const publicationCategoryOptions = publicationCategories.map(
        (category,index)=>({label:publicationCategoriesPL[index], value:category}))

    return(
        <KeyContext.Provider value={"category"}>
            <div className={"task-field-input"}>
                <label>
                    Kategoria
                </label>
                <SelectField options={publicationCategoryOptions}/>
            </div>
        </KeyContext.Provider>
    )}

export const DoiField = () => {
    return(
        <KeyContext.Provider value={"doi"}>
            <div className={"task-field-input col-md-7"}>
                <label>
                    DOI
                </label>
                <TextField/>
            </div>
        </KeyContext.Provider>
    )}

export const AuthorsField = () => {
    return(
        <KeyContext.Provider value={"authors"}>
            <div className={"task-field-input col-md-5"}>
                <label>
                    Autorzy
                </label>
                <TextField/>
            </div>
        </KeyContext.Provider>
    )}

export const TitleField = () => {
    return(
        <KeyContext.Provider value={"title"}>
            <div className={"task-field-input col-md-6"}>
                <label>
                    Tytuł
                </label>
                <TextField/>
            </div>
        </KeyContext.Provider>
    )}

export const MagazineField = () => {
    return(
        <KeyContext.Provider value={"magazine"}>
            <div className={"task-field-input col-md-6"}>
                <label>
                    Czasopismo
                </label>
                <TextField/>
            </div>
        </KeyContext.Provider>
    )}

export const YearField = () => {
    return(
        <KeyContext.Provider value={"year"}>
            <div className={"task-field-input"}>
                <label>
                    Rok wydania
                </label>
                <DateFieldOnlyYear/>
            </div>
        </KeyContext.Provider>
    )}

export const MinisterialPointsField = () => {
    return(
        <KeyContext.Provider value={"ministerialPoints"}>
            <div className={"task-field-input"}>
                <label>
                    Punkty ministerialne
                </label>
                <IntField/>
            </div>
        </KeyContext.Provider>
    )}

export const InformationsColumn = () => (
    <div className={"w-100 d-flex flex-row flex-wrap"}>
        <DoiField/>
        <AuthorsField/>
        <TitleField/>
        <MagazineField/>
    </div>
)
