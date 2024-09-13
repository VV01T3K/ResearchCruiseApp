import React, {useContext} from "react";
import { FieldValues} from "react-hook-form";
import {SingleValue} from "react-select";
import {BottomMenuWithAddButtonAndHistory,OrdinalNumber, RemoveRowButton} from "../TableParts";
import {FieldContext, FieldTableWrapper} from "../../Wrappers/FieldTableWrapper";
import {FormField} from "../FormYearSelect";
import {FormContext} from "../../Wrappers/FormTemplate";
import FieldWrapper from "../FieldWrapper";
import {notEmptyArray} from "../PublicationsTable/PublicationsTable";
import {InstitutionField, NoOfPersonsField} from "./GuestTeamsTableFields";



export type GuestsTeam = {
    institution: string,
    noOfPersons: string
}

const guestTeamDefault = {institution:"", noOfPersons: 0}


type Props = FormField & {
    historicalGuestsInstitutions: string[]
}

const guestTeamsTableContent = () =>
    [
        () => (<OrdinalNumber label={"Instytucja"}/>),
        InstitutionField,
        NoOfPersonsField,
        RemoveRowButton,
    ]

function GuestTeamsTable(props: Props) {


    const formContext = useContext(FormContext)

    const selectOptions =  props.historicalGuestsInstitutions?.map((institution, _)=>
        ({label:institution, value: {institution:institution, noOfPersons: 0}})) ?? []


    const mdColWidths = [10,60, 20, 10]
    const mdColTitles = ["Lp.", "Instytucja", "Liczba osób", ""]
    const colTitle = "Jednostki"
    const bottomMenu =
        <BottomMenuWithAddButtonAndHistory newOption={guestTeamDefault as SingleValue<any>} historicalOptions={selectOptions}/>
    const emptyText = "Nie dodano żadnej instytucji"
    const {Render} = FieldTableWrapper(colTitle, mdColWidths, mdColTitles, guestTeamsTableContent,
        bottomMenu, emptyText, formContext!.getValues(props.fieldName))


    const fieldProps = {
        ...props,
        defaultValue: [],
        rules: {
            required: false,
            validate: {
                notEmptyArray: notEmptyArray<GuestsTeam>,
                atLeastOnePerson: (value: GuestsTeam[]) =>
                    value.length === 0
                        ? true
                        : value.some((row: GuestsTeam) => Number(row.noOfPersons) <= 0)
                            ? "Liczba osób musi być większa niż 0"
                            : true            }
        },
        render: ({field}:FieldValues)=>  (
                <FieldContext.Provider value={field}>
                    <Render/>
                </FieldContext.Provider>
            )
    }

    return (
        <FieldWrapper {...fieldProps}/>
    )
}


export default GuestTeamsTable
