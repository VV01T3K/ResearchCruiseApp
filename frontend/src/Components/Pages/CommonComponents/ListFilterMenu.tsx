import React, {Dispatch, useState} from "react";
import Select from "react-select";


export type AnyStringFilterOption = {
    label: string,
    setFilter: Dispatch<any>
}

export type SelectStringFilterOption = {
    label: string,
    selectValues: string[],
    setFilter: Dispatch<any>
}

type Props = {
    className?: string,
    anyStringFilters: AnyStringFilterOption[]
    selectStringFilters: SelectStringFilterOption[]
}


export default function ListFilterMenu(props: Props) {
    const [showDropDown, setShowDropDown] = useState(false)

    const toggleFilters = () => {
        if (showDropDown) {
            setShowDropDown(false)
            props.anyStringFilters.forEach(filter =>
                filter.setFilter("")
            )
            props.selectStringFilters.forEach(filter =>
                filter.setFilter("")
            )
        }
        else {
            setShowDropDown(true)
        }
    }

    const selectStringFilterDefaultOption: Option = {
        label: "--- Filtr wyłączony ---",
        value: ""
    }

    return (
        <div className={`d-flex flex-wrap justify-content-start align-items-start p-2 ${props.className ?? ""}`}>
            <div className="d-flex flex-wrap justify-content-start align-items-center col-12">
                <button
                    className="btn btn-outline-info d-flex mb-2"
                    onClick={toggleFilters}
                    style={{ fontSize: "inherit" }}
                >
                    {showDropDown ? "Filtrowanie ▲" : "Filtrowanie ▼"}
                </button>

                {showDropDown && props.anyStringFilters.map((anyStringFilter, index) =>
                    <div
                        key={index}
                        className={`d-flex flex-wrap col-12 align-items-center mb-1`}
                    >
                        <div className="d-flex w-25">
                            {anyStringFilter.label}:
                        </div>
                        <input
                            className="d-flex form-control w-75"
                            style={{fontSize: "inherit"}}
                            onChange={(e) => {
                                anyStringFilter.setFilter(e.target.value)
                            }}
                        />
                    </div>
                )}
                {showDropDown && props.selectStringFilters.map((selectStringFilter, index) =>
                    <div
                        key={index}
                        className={`d-flex flex-wrap col-12 align-items-center ${index < props.anyStringFilters.length - 1 ? "mb-1" : ""}`}
                    >
                        <div className="d-flex w-25">
                            {selectStringFilter.label}:
                        </div>
                        <Select
                            className="d-flex w-75"
                            options={
                                [selectStringFilterDefaultOption].concat(
                                    selectStringFilter.selectValues.map(selectValue => ({
                                        label: selectValue,
                                        value: selectValue
                                    }))
                                )
                            }
                            defaultValue={selectStringFilterDefaultOption}
                            onChange={selectedOption =>
                                selectStringFilter.setFilter(selectedOption?.value)
                            }
                        />
                    </div>
                )}
            </div>
        </div>
    )
}