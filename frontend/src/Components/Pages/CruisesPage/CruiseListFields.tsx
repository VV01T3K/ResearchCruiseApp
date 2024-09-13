import {Cruise} from "./CruisesPage";
import ReadOnlyTextInput from "../../CommonComponents/ReadOnlyTextInput";
import {EMPTY_GUID} from "../CruiseFormPage/CruiseFormPage";
import AssignedCruiseApplicationsList from "./AssignedCruiseApplicationsList";
import React from "react";
import {CruisesTools} from "./CruisesList";
import LinkWithState from "../../CommonComponents/LinkWithState";
import {Path} from "../../Tools/Path";
import {HandleDeleteCruises} from "./CruisesPageMisc";

export const TableReadOnlyField = (props:{fieldLabel:string, fieldKey: keyof Cruise}) => {
    const {cruise} = CruisesTools()
    return (
        <div className={"task-field-input"}>
            <label className={"table-field-input-label"}>
                {props.fieldLabel}
            </label>
            <ReadOnlyTextInput value={cruise![props.fieldKey] as string}/>
        </div>
    )
}

export const Number = () => ( <TableReadOnlyField fieldLabel={"Numer:"} fieldKey={"number"}/> )

export const StartDate = () => ( <TableReadOnlyField fieldLabel={"Czas rozpoczęcia:"} fieldKey={"startDate"}/> )

export const EndDate = () => ( <TableReadOnlyField fieldLabel={"Czas zakończenia:"} fieldKey={"endDate"}/> )

export const MainCruiseManagerId = () => {
    const {cruise} = CruisesTools()
    return (
        <div className={"task-field-input"}>
            <label className={"table-field-input-label"}>
                Kierownik główny:
            </label>
            {cruise.mainCruiseManagerId == EMPTY_GUID ?
                <div>Nie przypisano</div> :
                <>
                    <ReadOnlyTextInput value={cruise.mainCruiseManagerFirstName} />
                    <ReadOnlyTextInput value={cruise.mainCruiseManagerLastName} />
                </>
            }
        </div>
    )
}

export const Cruises = () => {
    const {cruise} = CruisesTools()
    return (
        <div className={"task-field-input"}>
            <label className={"table-field-input-label"}>
                Zgłoszenia:
            </label>
            <AssignedCruiseApplicationsList cruiseApplicationsShortInfo={cruise.cruiseApplicationsShortInfo} />
        </div>
    )
}

export const Actions = () => {
    const {cruise} = CruisesTools()
    const handleDeleteCruise = HandleDeleteCruises()

    return (
        <div className="btn-group-vertical">
            <LinkWithState className="cruises-button" to={Path.CruiseForm} label="Szczegóły" state={{cruise: cruise}}/>
            <button className="cruises-button" onClick={() => handleDeleteCruise(cruise.id)}>
                Usuń
            </button>
        </div>
    )
}