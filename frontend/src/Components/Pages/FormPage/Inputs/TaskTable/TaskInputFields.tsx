import {DateFieldEnd, DateFieldStart, FloatField, StandardDateField, TextField} from "../CellFields";
import React from "react";

export const AuthorField = () =>
    (
        <div className={"task-field-input col-md-4"}>
            <label>Autor</label>
            <TextField/>
        </div>
    )

export const TitleField = () =>
    (
        <div className={"task-field-input col-md-8"}>
            <label>Tytuł</label>
            <TextField/>
        </div>
    )

export const InstitutionField = () =>
    (
        <div className={"task-field-input col-8 "}>
            <label>Instytucja, do której składany</label>
            <TextField/>
        </div>
    )

export const DateField = () =>
    (
        <div className={"task-field-input col-md-4"}>
            <label>Przewidywany termin składania</label>
            <StandardDateField/>
        </div>
    )

export const StartDateField = () =>
    (
        <>
            <label className="p-2 pb-0 align-items-center d-flex" > <span>Ramy czasowe:</span></label>
            <div className={"task-field-input col-md-4"}>
                <label>Od</label>
                <DateFieldStart/>
            </div>
        </>
    )

export const EndDateField = () =>
    (
        <div className={"task-field-input col-md-4 "}>
            <label>Do</label>
            <DateFieldEnd/>
        </div>
    )

export const FinancingAmountField = () =>
    (
        <div className={"task-field-input col-md-4 "}>
            <label>Kwota finansowania (zł)</label>
            <FloatField/>
        </div>
    )

export const TaskDescriptionField = () =>
    (
        <div className={"task-field-input"}>
            <label>
                Opis zadania
            </label>
            <TextField/>
        </div>
    )

export const DidacticsDescriptionField = () =>
    (
        <div className={"task-field-input"}>
            <label>
                Opis zajęcia dydaktycznego
            </label>
            <TextField/>
        </div>
    )
