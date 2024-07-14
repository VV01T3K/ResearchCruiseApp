import React, {Dispatch, useState} from "react";
import Select from "react-select";


export type ListFilterOption = {
    label: string,
    setFilter: Dispatch<any>
}

type Props = {
    className?: string,
    collection: any[],
    customStringFilters: ListFilterOption[]
}


export default function ListFilterMenu(props: Props) {
    const [showDropDown, setShowDropDown] = useState(false)

    return (
        <div className={`d-flex flex-wrap justify-content-start align-items-start p-3 ${props.className ?? ""}`}>
            <div className="d-flex flex-wrap justify-content-start align-items-center col-12">
                <button
                    className="btn btn-outline-info d-flex mb-2"
                    onClick={() => setShowDropDown(!showDropDown)}
                    style={{ fontSize: "inherit" }}
                >
                    {showDropDown ? "Filtrowanie ▲" : "Filtrowanie ▼"}
                </button>

                {showDropDown && props.customStringFilters.map((customStringFilter, index) =>
                    <div className={`d-flex flex-wrap col-12 align-items-center ${index < props.customStringFilters.length - 1 ? "mb-1" : ""}`}>
                        <div className="d-flex w-25">
                            {customStringFilter.label}:
                        </div>
                        <input
                            className="d-flex form-control w-75"
                            style={{fontSize: "inherit"}}
                            onChange={(e) => {
                                console.log(e.target.value)
                                customStringFilter.setFilter(e.target.value)
                            }}
                        />
                    </div>
                )}
            </div>
        </div>
    )
}