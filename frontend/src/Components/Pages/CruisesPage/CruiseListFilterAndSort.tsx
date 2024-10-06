import {Cruise, CruiseStateContext} from "./CruisesPage";
import {AnyStringFilterOption} from "../CommonComponents/ListFilterMenu";
import React, {useContext, useState} from "react";

export const sortCruiseListByNumber = (list: Cruise[]) => [...list.sort((a: Cruise, b: Cruise): number =>(a.number.localeCompare(b.number))
)]

export const sortCruiseListByStartDate = (list: Cruise[]) => [...list.sort((a: Cruise, b: Cruise): number =>
    (Date.parse(a.startDate) - Date.parse(b.startEndDate)))]


export const cruiseListSortOptions = (list: Cruise[]) => [
    {label: "Numer (rosnąco)", value: ()=>sortCruiseListByNumber(list)},
    {label: "Numer (malejąco)", value: ()=>sortCruiseListByNumber(list).reverse()},
    {label: "Czas rozpoczęcia (rosnąco)", value: ()=>sortCruiseListByStartDate(list)},
    {label: "Czas rozpoczęcia (malejąco)", value: ()=>sortCruiseListByStartDate(list).reverse()},
]

export const FilterMapper = (props:{filterOptions: AnyStringFilterOption[], optionClassName?:string}) => (
    <>
        {props.filterOptions.map((anyStringFilter, index) =>
            <div key={index} className={props.optionClassName}>
                <input
                    className="field-common" placeholder={anyStringFilter.label}
                    onChange={(e) => {
                        anyStringFilter.setFilter(e.target.value)
                    }}
                />
            </div>
        )}
    </>
)

export const CruisesListFilterAndSort = () => {
    const cruiseStateContext = useContext(CruiseStateContext)

    const [cruiseManagerLastNameFilter, setCruiseManagerLastNameFilter]
        = useState("")

    const applyFilters = (row: Cruise): boolean => {
        return (
            (
                cruiseManagerLastNameFilter == "" ||
                row.mainCruiseManagerLastName.toLowerCase().includes(cruiseManagerLastNameFilter.toLowerCase())
            )
        )
    }

    const cruisesToDisplay = sortCruiseListByStartDate(cruiseStateContext!.cruises)?.filter(applyFilters)

    const sortOptions = cruiseListSortOptions(cruiseStateContext!.cruises)

    const anyStringFilterOptions: AnyStringFilterOption[] = [
        {
            label: "Nazwisko kierownika",
            setFilter: setCruiseManagerLastNameFilter
        }
    ]

    return {
        cruisesToDisplay:cruisesToDisplay,
        sortOptions:sortOptions,
        anyStringFilterOptions:anyStringFilterOptions
    }
}