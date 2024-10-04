import React from "react";
import {OrdinalNumber} from "../TableParts";
import {FieldTableWrapper} from "../../Wrappers/FieldTableWrapper";
import {FieldLabel} from "../FieldWrapper";
import {DisplayValueContext, DisplayWrapper} from "../TaskTable/EvaluatedTaskTable";
import {InitContext, NoOfEmployeesField, NoOfStudentsField, UgTeam, UgUnit, UnitField} from "./UgTeamsTable";


const ugTeamsTableContent = () =>
    [
        ()=>(<OrdinalNumber label={"Jednostka"}/>),
        DisplayWrapper(UnitField),
        DisplayWrapper(NoOfEmployeesField),
        DisplayWrapper(NoOfStudentsField),
    ]

type Props =  {
    initValues: UgUnit[]
    ugTeams?: UgTeam[]
    fieldLabel:string,
    className?:string
}

function EvaluatedUgTeamsTable(props: Props) {

    const mdColWidths = [10,42, 24, 24]
    const mdColTitles = ["Lp.", "Jednostka", "Liczba pracowników", "Liczba studentów"]
    const colTitle = "Jednostki"
    const emptyText = "Nie dodano żadnej jednostki"
    const {Render} = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, ugTeamsTableContent,
        null, emptyText,  props.ugTeams )
    return (
        <div className={props.className + " field-wrapper"}>
            <FieldLabel fieldLabel={props.fieldLabel}/>
                <DisplayValueContext.Provider value={props.ugTeams}>
                    <Render/>
                </DisplayValueContext.Provider>
        </div>
    )
}


export default EvaluatedUgTeamsTable